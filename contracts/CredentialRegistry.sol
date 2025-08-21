// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
// Counters removed in OZ v5; using simple uint256 counters instead

/**
 * @title CredVerse Credential Registry
 * @dev Smart contract for managing verifiable credentials on Polygon blockchain
 * @author CredVerse Team
 */
contract CredentialRegistry is AccessControl, Pausable, ReentrancyGuard {

    // Role definitions
    bytes32 public constant ISSUER_ROLE = keccak256("ISSUER_ROLE");
    bytes32 public constant VERIFIER_ROLE = keccak256("VERIFIER_ROLE");
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");

    // Events
    event CredentialAnchored(
        bytes32 indexed credentialHash,
        address indexed issuer,
        uint256 timestamp,
        string credentialId
    );

    event CredentialRevoked(
        bytes32 indexed credentialHash,
        address indexed issuer,
        uint256 timestamp,
        string reason
    );

    event IssuerRegistered(
        address indexed issuer,
        string did,
        string name,
        uint256 timestamp
    );

    event IssuerRemoved(
        address indexed issuer,
        uint256 timestamp
    );

    event VerifierRegistered(
        address indexed verifier,
        string name,
        uint256 timestamp
    );

    event VerifierRemoved(
        address indexed verifier,
        uint256 timestamp
    );

    // Structs
    struct Credential {
        bytes32 hash;
        address issuer;
        uint256 timestamp;
        bool isRevoked;
        string revocationReason;
        string credentialId;
        string ipfsHash;
        string arweaveId;
    }

    struct Issuer {
        string did;
        string name;
        bool isActive;
        uint256 registrationDate;
        uint256 totalCredentials;
        uint256 revokedCredentials;
    }

    struct Verifier {
        string name;
        bool isActive;
        uint256 registrationDate;
        uint256 totalVerifications;
    }

    // State variables
    uint256 private _credentialCounter;
    uint256 private _issuerCounter;
    uint256 private _verifierCounter;

    mapping(bytes32 => Credential) public credentials;
    mapping(address => Issuer) public issuers;
    mapping(address => Verifier) public verifiers;
    mapping(address => bool) public registeredAddresses;

    // Credential hashes by issuer
    mapping(address => bytes32[]) public issuerCredentials;
    
    // Revoked credentials
    mapping(bytes32 => bool) public revokedCredentials;

    // Contract metadata
    string public constant CONTRACT_VERSION = "2.0.0";
    string public constant CONTRACT_NAME = "CredVerse Credential Registry";

    // Modifiers
    modifier onlyIssuer() {
        require(hasRole(ISSUER_ROLE, msg.sender), "CredVerse: Caller is not an issuer");
        require(issuers[msg.sender].isActive, "CredVerse: Issuer is not active");
        _;
    }

    modifier onlyVerifier() {
        require(hasRole(VERIFIER_ROLE, msg.sender), "CredVerse: Caller is not a verifier");
        require(verifiers[msg.sender].isActive, "CredVerse: Verifier is not active");
        _;
    }

    modifier onlyAdmin() {
        require(hasRole(ADMIN_ROLE, msg.sender), "CredVerse: Caller is not an admin");
        _;
    }

    modifier credentialExists(bytes32 credentialHash) {
        require(credentials[credentialHash].hash != bytes32(0), "CredVerse: Credential does not exist");
        _;
    }

    modifier credentialNotRevoked(bytes32 credentialHash) {
        require(!credentials[credentialHash].isRevoked, "CredVerse: Credential is revoked");
        _;
    }

    // Constructor
    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ADMIN_ROLE, msg.sender);
        _grantRole(ISSUER_ROLE, msg.sender);
        _grantRole(VERIFIER_ROLE, msg.sender);
    }

    /**
     * @dev Anchor a credential to the blockchain
     * @param credentialHash Hash of the credential
     * @param credentialId Unique identifier for the credential
     * @param ipfsHash IPFS hash of the credential metadata
     * @param arweaveId Arweave ID of the credential metadata
     */
    function anchorCredential(
        bytes32 credentialHash,
        string memory credentialId,
        string memory ipfsHash,
        string memory arweaveId
    ) external onlyIssuer nonReentrant whenNotPaused {
        require(credentialHash != bytes32(0), "CredVerse: Invalid credential hash");
        require(bytes(credentialId).length > 0, "CredVerse: Invalid credential ID");
        require(credentials[credentialHash].hash == bytes32(0), "CredVerse: Credential already exists");

        // Create credential record
        credentials[credentialHash] = Credential({
            hash: credentialHash,
            issuer: msg.sender,
            timestamp: block.timestamp,
            isRevoked: false,
            revocationReason: "",
            credentialId: credentialId,
            ipfsHash: ipfsHash,
            arweaveId: arweaveId
        });

        // Update issuer stats
        issuers[msg.sender].totalCredentials++;
        issuerCredentials[msg.sender].push(credentialHash);

        _credentialCounter += 1;

        emit CredentialAnchored(credentialHash, msg.sender, block.timestamp, credentialId);
    }

    /**
     * @dev Revoke a credential
     * @param credentialHash Hash of the credential to revoke
     * @param reason Reason for revocation
     */
    function revokeCredential(
        bytes32 credentialHash,
        string memory reason
    ) external onlyIssuer nonReentrant whenNotPaused {
        require(credentials[credentialHash].issuer == msg.sender, "CredVerse: Only issuer can revoke");
        require(!credentials[credentialHash].isRevoked, "CredVerse: Credential already revoked");

        credentials[credentialHash].isRevoked = true;
        credentials[credentialHash].revocationReason = reason;
        revokedCredentials[credentialHash] = true;

        // Update issuer stats
        issuers[msg.sender].revokedCredentials++;

        emit CredentialRevoked(credentialHash, msg.sender, block.timestamp, reason);
    }

    /**
     * @dev Verify a credential's validity
     * @param credentialHash Hash of the credential to verify
     * @return isValid Whether the credential is valid
     * @return issuer Address of the credential issuer
     * @return timestamp When the credential was issued
     * @return isRevoked Whether the credential is revoked
     */
    function verifyCredential(
        bytes32 credentialHash
    ) external view returns (
        bool isValid,
        address issuer,
        uint256 timestamp,
        bool isRevoked
    ) {
        Credential memory credential = credentials[credentialHash];
        
        if (credential.hash == bytes32(0)) {
            return (false, address(0), 0, false);
        }

        isValid = !credential.isRevoked && credential.hash != bytes32(0);
        issuer = credential.issuer;
        timestamp = credential.timestamp;
        isRevoked = credential.isRevoked;

        // Update verifier stats if caller is a verifier
        if (hasRole(VERIFIER_ROLE, msg.sender) && verifiers[msg.sender].isActive) {
            // Note: This would require a separate function to update stats due to view modifier
        }
    }

    /**
     * @dev Get credential details
     * @param credentialHash Hash of the credential
     * @return credential Full credential data
     */
    function getCredential(
        bytes32 credentialHash
    ) external view returns (Credential memory credential) {
        return credentials[credentialHash];
    }

    /**
     * @dev Get all credentials for an issuer
     * @param issuer Address of the issuer
     * @return Array of credential hashes
     */
    function getIssuerCredentials(
        address issuer
    ) external view returns (bytes32[] memory) {
        return issuerCredentials[issuer];
    }

    /**
     * @dev Register a new issuer
     * @param did Decentralized identifier of the issuer
     * @param name Name of the issuer
     */
    function registerIssuer(
        string memory did,
        string memory name
    ) external onlyAdmin nonReentrant whenNotPaused {
        require(bytes(did).length > 0, "CredVerse: Invalid DID");
        require(bytes(name).length > 0, "CredVerse: Invalid name");
        require(!registeredAddresses[msg.sender], "CredVerse: Address already registered");

        issuers[msg.sender] = Issuer({
            did: did,
            name: name,
            isActive: true,
            registrationDate: block.timestamp,
            totalCredentials: 0,
            revokedCredentials: 0
        });

        registeredAddresses[msg.sender] = true;
        _grantRole(ISSUER_ROLE, msg.sender);
        _issuerCounter += 1;

        emit IssuerRegistered(msg.sender, did, name, block.timestamp);
    }

    /**
     * @dev Register a new verifier
     * @param name Name of the verifier
     */
    function registerVerifier(
        string memory name
    ) external onlyAdmin nonReentrant whenNotPaused {
        require(bytes(name).length > 0, "CredVerse: Invalid name");
        require(!registeredAddresses[msg.sender], "CredVerse: Address already registered");

        verifiers[msg.sender] = Verifier({
            name: name,
            isActive: true,
            registrationDate: block.timestamp,
            totalVerifications: 0
        });

        registeredAddresses[msg.sender] = true;
        _grantRole(VERIFIER_ROLE, msg.sender);
        _verifierCounter += 1;

        emit VerifierRegistered(msg.sender, name, block.timestamp);
    }

    /**
     * @dev Remove an issuer
     * @param issuer Address of the issuer to remove
     */
    function removeIssuer(address issuer) external onlyAdmin nonReentrant whenNotPaused {
        require(issuers[issuer].isActive, "CredVerse: Issuer not found or inactive");
        
        issuers[issuer].isActive = false;
        _revokeRole(ISSUER_ROLE, issuer);
        
        emit IssuerRemoved(issuer, block.timestamp);
    }

    /**
     * @dev Remove a verifier
     * @param verifier Address of the verifier to remove
     */
    function removeVerifier(address verifier) external onlyAdmin nonReentrant whenNotPaused {
        require(verifiers[verifier].isActive, "CredVerse: Verifier not found or inactive");
        
        verifiers[verifier].isActive = false;
        _revokeRole(VERIFIER_ROLE, verifier);
        
        emit VerifierRemoved(verifier, block.timestamp);
    }

    /**
     * @dev Pause the contract
     */
    function pause() external onlyAdmin {
        _pause();
    }

    /**
     * @dev Unpause the contract
     */
    function unpause() external onlyAdmin {
        _unpause();
    }

    /**
     * @dev Get contract statistics
     * @return totalCredentials Total number of credentials
     * @return totalIssuers Total number of issuers
     * @return totalVerifiers Total number of verifiers
     */
    function getContractStats() external view returns (
        uint256 totalCredentials,
        uint256 totalIssuers,
        uint256 totalVerifiers
    ) {
        return (
            _credentialCounter,
            _issuerCounter,
            _verifierCounter
        );
    }

    /**
     * @dev Check if an address is a registered issuer
     * @param issuer Address to check
     * @return Whether the address is a registered issuer
     */
    function isIssuer(address issuer) external view returns (bool) {
        return hasRole(ISSUER_ROLE, issuer) && issuers[issuer].isActive;
    }

    /**
     * @dev Check if an address is a registered verifier
     * @param verifier Address to check
     * @return Whether the address is a registered verifier
     */
    function isVerifier(address verifier) external view returns (bool) {
        return hasRole(VERIFIER_ROLE, verifier) && verifiers[verifier].isActive;
    }

    /**
     * @dev Get issuer information
     * @param issuer Address of the issuer
     * @return Issuer information
     */
    function getIssuer(address issuer) external view returns (Issuer memory) {
        return issuers[issuer];
    }

    /**
     * @dev Get verifier information
     * @param verifier Address of the verifier
     * @return Verifier information
     */
    function getVerifier(address verifier) external view returns (Verifier memory) {
        return verifiers[verifier];
    }

    /**
     * @dev Emergency function to recover stuck tokens (if any)
     * @param token Address of the token to recover
     * @param to Address to send tokens to
     * @param amount Amount of tokens to recover
     */
    function emergencyRecover(
        address token,
        address to,
        uint256 amount
    ) external onlyAdmin {
        // Implementation for token recovery if needed
    }

    // Override required functions
    function supportsInterface(bytes4 interfaceId) public view override(AccessControl) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
