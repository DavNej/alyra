const { assert, expect } = require("chai")
const { network, deployments, ethers } = require("hardhat")
const { developmentChains } = require("../../helper-hardhat-config")

!developmentChains.includes(network.name)
    ? describe.skip
    : describe.skip("Spa Unit Tests", function () {
        let accounts;
        let spa;
        before(async () => {
            // could also do with getNamedAccounts
            accounts = await ethers.getSigners() 
            deployer = accounts[0]
        })

        describe("Add", async function() {
            beforeEach(async() => {
                await deployments.fixture(["spa"])
                spa = await ethers.getContract("Spa")
            })

            it("should add an animal", async function() {
                await expect(spa.add("Bleu Russe", 30, 10)).to.emit(
                    spa,
                    "animalAdded"
                )
                let animal = await spa.get(0)
                assert(animal.race === "Bleu Russe")
            })
        })

        describe("Get", async function() {
            beforeEach(async() => {
                await deployments.fixture(["spa"])
                spa = await ethers.getContract("Spa")
                await spa.add("Bleu Russe", 30, 10)
            })

            it("should get an animal", async function() {
                let animal = await spa.get(0)
                assert(animal.race === "Bleu Russe")
            })
        })

        describe("Set", async function() {
            beforeEach(async() => {
                await deployments.fixture(["spa"])
                spa = await ethers.getContract("Spa")
                await spa.add("Bleu Russe", 30, 10)
            })

            it("should set an animal", async function() {
                await spa.set(0, "Rouge Russe", 31, 16)
                let animal = await spa.get(0)
                assert(animal.race === "Rouge Russe")
                assert(animal.size.toString() === "31")
                assert(animal.age.toString() === "16")
                assert(animal.isAdopted === false)
            })
        })

        describe("Remove", async function() {
            beforeEach(async() => {
                await deployments.fixture(["spa"])
                spa = await ethers.getContract("Spa")
                await spa.add("Bleu Russe", 30, 10)
            })

            it("should remove an animal", async function() {
                let animal = await spa.get(0)
                assert(animal.race === "Bleu Russe")
                await spa.remove(0)
                animal = await spa.get(0)
                assert(animal.race === "")
            })
        })

        describe("Adopt", function() {
            beforeEach(async() => {
                await deployments.fixture(["spa"])
                spa = await ethers.getContract("Spa")
                await spa.add("Bleu Russe", 30, 10)
                await spa.add("Berger Allemand", 70, 3)
            })

            it('should adopt an animal', async function() {
                await expect(await spa.adopt(1)).to.emit(
                    spa,
                    "animalAdopted"
                )
                let animal = await spa.get(1)
                assert(animal.isAdopted === true)
                let addressToAnimalAdopted = await spa.adoption(deployer.address)
                assert(addressToAnimalAdopted.toString() === "1")
            })

            it('should NOT adopt an animal if this animal is already adopted', async function() {
                await spa.adopt(1)
                await expect(spa.adopt(1)).to.be.revertedWithCustomError(
                    spa,
                    "Spa__AlreadyAdopted"
                )
            })            
        })

        describe("Adopt", function() {
            beforeEach(async() => {
                await deployments.fixture(["spa"])
                spa = await ethers.getContract("Spa")
                await spa.add("Bleu Russe", 30, 10)
                await spa.add("Berger Allemand", 70, 3)
                await spa.adopt(0)
            })

            it('should get the animal adopted by an address', async function() {
                let animal = await spa.getAdoption(deployer.address)
                assert(animal.race === "Bleu Russe");
                assert(animal.isAdopted === true)
            })
        })

        describe("AdoptIfMax", function() {
            beforeEach(async() => {
                await deployments.fixture(["spa"])
                spa = await ethers.getContract("Spa")
                await spa.add("Bleu Russe", 30, 10)
                await spa.add("Berger Allemand", 70, 3)
                await spa.add("Doberman", 50, 5)
            })

            it("should adopt if correct values are provided", async function() {
                let animal = await spa.get(2)
                assert(animal.isAdopted === false)
                await expect(spa.connect(accounts[1]).adoptIfMax("Doberman", 70, 6)).to.emit(
                    spa,
                    "animalAdopted"
                )
                animal = await spa.get(2)
                assert(animal.isAdopted === true)
            })

            it("should NOT adopt an animal if no animal corresponds to the settings", async function() {
                let animal = await spa.get(1)
                assert(animal.isAdopted === false)
                let result = await spa.connect(accounts[1]).callStatic.adoptIfMax("Berger Allemand", 60, 6)
                assert(result === false)
                animal = await spa.get(1)
                assert(animal.isAdopted === false)
            })
        })

        describe("Worflow status tests", function() {
            before(async() => {
                await deployments.fixture(["spa"])
                spa = await ethers.getContract("Spa")
            })

            it("should add an animal", async function() {
                await expect(await spa.add("Bleu Russe", 30, 10)).to.emit(
                    spa,
                    "animalAdded"
                )
                let animal = await spa.get(0)
                assert(animal[0] === "Bleu Russe")
            })

            it("should get an animal", async function() {
                let animal = await spa.get(0)
                assert(animal[0] === "Bleu Russe")
            })

            it('should set an animal', async function() {
                await spa.set(0, "Rouge Russe", 31, 16)
                let animal = await spa.get(0)
                assert(animal[0] === "Rouge Russe")
                assert(animal[1].toString() === "31")
                assert(animal[2].toString() === "16")
                assert(animal[3] === false)
            })

            it('should remove an animal', async function() {
                await spa.remove(0)
                let animal = await spa.get(0)
                assert(animal[0] === "")
            })

            it("should add an animal", async function() {
                await expect(await spa.add("Bleu Russe", 30, 10)).to.emit(
                    spa,
                    "animalAdded"
                )
                let animal = await spa.get(1)
                assert(animal[0] === "Bleu Russe")
            })

            it('should adopt en animal', async function() {
                await expect(await spa.adopt(1)).to.emit(
                    spa,
                    "animalAdopted"
                )
                let animal = await spa.get(1)
                assert(animal[3] === true)
            })

            it('should get the animal adopted by an address', async function() {
                let animal = await spa.getAdoption(deployer.address)
                assert(animal[0] === "Bleu Russe")
            })

            it("should add an animal", async function() {
                await expect(await spa.add("Doberman", 50, 5)).to.emit(
                    spa,
                    "animalAdded"
                )
                let animal = await spa.get(2)
                assert(animal[0] === "Doberman")
            })

            it("should adopt if correct values are provided", async function() {
                await expect(spa.connect(accounts[1]).adoptIfMax("Doberman", 60, 6)).to.emit(
                    spa,
                    "animalAdopted"
                )
                let animal = await spa.get(2)
                assert(animal.isAdopted === true)
            })

            //////////////////////////
            it("should add an animal", async function() {
                await expect(await spa.add("Renard", 50, 5)).to.emit(
                    spa,
                    "animalAdded"
                )
                let animal = await spa.get(3)
                assert(animal[0] === "Renard")
            })



        })
    })
