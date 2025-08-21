const { ethers } = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("🚀 Starting CredVerse smart contract deployment...\n");

  // Get the deployer account
  const [deployer] = await ethers.getSigners();
  console.log("📝 Deploying contracts with account:", deployer.address);
  console.log("💰 Account balance:", (await deployer.getBalance()).toString(), "\n");

  // Get network information
  const network = await ethers.provider.getNetwork();
  console.log("🌐 Network:", network.name);
  console.log("🔗 Chain ID:", network.chainId, "\n");

  // Deploy CredentialRegistry contract
  console.log("📜 Deploying CredentialRegistry contract...");
  const CredentialRegistry = await ethers.getContractFactory("CredentialRegistry");
  const credentialRegistry = await CredentialRegistry.deploy();
  await credentialRegistry.deployed();

  console.log("✅ CredentialRegistry deployed to:", credentialRegistry.address);
  console.log("📋 Transaction hash:", credentialRegistry.deployTransaction.hash, "\n");

  // Wait for a few block confirmations
  console.log("⏳ Waiting for block confirmations...");
  await credentialRegistry.deployTransaction.wait(5);
  console.log("✅ Contract confirmed on blockchain\n");

  // Get contract information
  const contractName = await credentialRegistry.CONTRACT_NAME();
  const contractVersion = await credentialRegistry.CONTRACT_VERSION();
  
  console.log("📋 Contract Details:");
  console.log("   Name:", contractName);
  console.log("   Version:", contractVersion);
  console.log("   Address:", credentialRegistry.address, "\n");

  // Get initial contract stats
  const stats = await credentialRegistry.getContractStats();
  console.log("📊 Initial Contract Statistics:");
  console.log("   Total Credentials:", stats.totalCredentials.toString());
  console.log("   Total Issuers:", stats.totalIssuers.toString());
  console.log("   Total Verifiers:", stats.totalVerifiers.toString(), "\n");

  // Check deployer roles
  const hasAdminRole = await credentialRegistry.hasRole(
    await credentialRegistry.ADMIN_ROLE(),
    deployer.address
  );
  const hasIssuerRole = await credentialRegistry.hasRole(
    await credentialRegistry.ISSUER_ROLE(),
    deployer.address
  );
  const hasVerifierRole = await credentialRegistry.hasRole(
    await credentialRegistry.VERIFIER_ROLE(),
    deployer.address
  );

  console.log("🔐 Deployer Roles:");
  console.log("   Admin:", hasAdminRole);
  console.log("   Issuer:", hasIssuerRole);
  console.log("   Verifier:", hasVerifierRole, "\n");

  // Save deployment information
  const deploymentInfo = {
    network: network.name,
    chainId: network.chainId,
    deployer: deployer.address,
    contracts: {
      CredentialRegistry: {
        address: credentialRegistry.address,
        name: contractName,
        version: contractVersion,
        transactionHash: credentialRegistry.deployTransaction.hash,
        blockNumber: credentialRegistry.deployTransaction.blockNumber,
        gasUsed: credentialRegistry.deployTransaction.gasLimit.toString(),
        deployer: deployer.address,
        timestamp: new Date().toISOString(),
        roles: {
          admin: hasAdminRole,
          issuer: hasIssuerRole,
          verifier: hasVerifierRole
        }
      }
    },
    deployment: {
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || "development",
      hardhatVersion: require("hardhat/package.json").version
    }
  };

  // Create deployments directory if it doesn't exist
  const deploymentsDir = path.join(__dirname, "..", "deployments");
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir, { recursive: true });
  }

  // Save deployment info to file
  const deploymentFile = path.join(deploymentsDir, `${network.name}-${network.chainId}.json`);
  fs.writeFileSync(deploymentFile, JSON.stringify(deploymentInfo, null, 2));
  console.log("💾 Deployment information saved to:", deploymentFile);

  // Update environment file if it exists
  const envFile = path.join(__dirname, "..", ".env");
  if (fs.existsSync(envFile)) {
    let envContent = fs.readFileSync(envFile, "utf8");
    
    // Update or add contract address
    if (envContent.includes("NEXT_PUBLIC_CREDENTIAL_REGISTRY_ADDRESS=")) {
      envContent = envContent.replace(
        /NEXT_PUBLIC_CREDENTIAL_REGISTRY_ADDRESS=.*/,
        `NEXT_PUBLIC_CREDENTIAL_REGISTRY_ADDRESS="${credentialRegistry.address}"`
      );
    } else {
      envContent += `\nNEXT_PUBLIC_CREDENTIAL_REGISTRY_ADDRESS="${credentialRegistry.address}"\n`;
    }

    // Update or add network ID
    if (envContent.includes("NEXT_PUBLIC_NETWORK_ID=")) {
      envContent = envContent.replace(
        /NEXT_PUBLIC_NETWORK_ID=.*/,
        `NEXT_PUBLIC_NETWORK_ID="${network.chainId}"`
      );
    } else {
      envContent += `NEXT_PUBLIC_NETWORK_ID="${network.chainId}"\n`;
    }

    fs.writeFileSync(envFile, envContent);
    console.log("🔧 Environment file updated with contract address and network ID");
  }

  // Verify contract on block explorer (if not local network)
  if (network.chainId !== 31337) {
    console.log("\n🔍 Verifying contract on block explorer...");
    try {
      await hre.run("verify:verify", {
        address: credentialRegistry.address,
        constructorArguments: [],
      });
      console.log("✅ Contract verified successfully!");
    } catch (error) {
      console.log("⚠️  Contract verification failed:", error.message);
      console.log("   You can verify manually using the contract address and constructor arguments");
    }
  }

  // Print summary
  console.log("\n" + "=".repeat(60));
  console.log("🎉 DEPLOYMENT COMPLETED SUCCESSFULLY!");
  console.log("=".repeat(60));
  console.log("📋 Contract: CredentialRegistry");
  console.log("📍 Address:", credentialRegistry.address);
  console.log("🌐 Network:", network.name);
  console.log("🔗 Chain ID:", network.chainId);
  console.log("👤 Deployer:", deployer.address);
  console.log("⏰ Timestamp:", new Date().toISOString());
  console.log("=".repeat(60));

  // Print next steps
  console.log("\n📋 Next Steps:");
  console.log("1. Update your frontend with the contract address");
  console.log("2. Test the contract functions");
  console.log("3. Register issuers and verifiers");
  console.log("4. Start issuing credentials!");
  console.log("\n🚀 Happy building with CredVerse!");

  return {
    credentialRegistry: credentialRegistry.address,
    network: network.name,
    chainId: network.chainId
  };
}

// Handle errors
main()
  .then((result) => {
    console.log("\n✅ Deployment script completed successfully");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n❌ Deployment failed:", error);
    process.exit(1);
  });
