import { network } from "hardhat";

async function main() {
  const { viem } = await network.connect();

  const libraryManagement = await viem.deployContract("LibraryManagement");

  console.log("LibraryManagement deployed to:", libraryManagement.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
