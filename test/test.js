const { assert } = require("chai");

describe('InsurancePool', function () {
    let pool;

    beforeEach(async () => {
      const InsurancePool = await ethers.getContractFactory("InsurancePool");
      pool = await InsurancePool.deploy();
      await pool.deployed();
    });

    describe('Key functions', function () {

        it('Deposit', async () => {
          await pool.deposit({ value: 10 });
          const balance = await ethers.provider.getBalance(pool.address);
          assert.equal(balance.toString(), 10);
        });

        it('Withdraw', async () => {
          await pool.deposit({ value: 10 });
          await pool.withdraw(5);
          const balance = await ethers.provider.getBalance(pool.address);
          assert.equal(balance.toString(), 5);
        });

        it('Withdraw requires : should revert', async () => {
          await pool.deposit({ value: 1 });
          let ex;
          try {
              await pool.withdraw({ value: 10 });
          }
          catch (_ex) {
              ex = _ex;
          }
          assert(ex, 'Should withdraw more than the deposit');
        });

        it('Purchase', async () => {
          await pool.deposit({ value: 1000 })
          const price = await pool.pricePurchase(100, 1, 1);
          await pool.purchase(100, 1, { value: price });
          const balance = await ethers.provider.getBalance(pool.address);
          assert.equal(balance.toString(), 1000+1);
        });

        it('Purchase requires : should revert', async () => {
          await pool.deposit({ value: 10 });
          const price = await pool.pricePurchase(100000, 1, 1);
          let ex;
          try {
              await pool.purchase(100, 1, { value: price });
          }
          catch (_ex) {
              ex = _ex;
          }
          assert(ex, 'Should withdraw more than the deposit');
        });
    });

    describe('Maths', function () {

        it('InterestFromPurchase', async () => {
          await pool.deposit({ value: 1000})
          const price = await pool.pricePurchase(1000, 3, 1);
          const coms = await pool.comsPurchase(1000, 3, 1);
          await pool.deposit({ value: 10000 });
          await pool.purchase(1000, 3, { value: price });
          const interests = await pool.getMyInterests();
          assert.equal(interests.toString(),(price-coms).toString());
        });

        it('HealthFactor', async () => {
          const price = await pool.pricePurchase(10, 3, 1);
          await pool.deposit({ value: 10 });
          let ex;
          try {
              await pool.purchase(100, 3, { value: price });;
          }
          catch (_ex) {
              ex = _ex;
          }
          assert(ex, 'healthFactor is < 1');
        });
    });

    describe('Get functions', function () {

        it('getTotalDeposit', async () => {
          await pool.deposit({ value: 5 });
          await pool.deposit({ value: 5 });
          const totalDeposit = await pool.getTotalDeposit();
          assert.equal(totalDeposit.toString(), 2);
        });

        it('getMyBalance', async () => {
          await pool.deposit({ value: 10 });
          await pool.withdraw(7);
          await pool.deposit({ value: 8 });
          const balance = await pool.getMyBalance();
          assert.equal(balance.toString(), 11);
        });

        it('getContractBalance', async () => {
          await pool.deposit({ value: 10 });
          const balance = await pool.getContractBalance();
          assert.equal(balance.toString(), 10);
        });

        it('getTotalPurchase', async () => {
          await pool.deposit({ value: 10000 });
          const price = await pool.pricePurchase(10, 3, 1);
          await pool.purchase(10, 3, { value: price });
          await pool.purchase(10, 3, { value: price });
          const totalPurchase = await pool.getTotalPurchase();
          assert.equal(totalPurchase.toString(), 2);
        });

        it('getCapitalInsurer', async () => {
          await pool.deposit({ value: 10000 });
          const capitalInsurer = await pool.getCapitalInsurer();
          assert.equal(capitalInsurer.toString(), 10000);
        });

        it('getCapitalInsured', async () => {
          await pool.deposit({ value: 1000})
          const price = await pool.pricePurchase(10, 3, 1);
          await pool.purchase(10, 3, { value: price });
          const capitalInsured = await pool.getCapitalInsured();
          assert.equal(capitalInsured.toString(), 10);
        });

        it('getReserve', async () => {
          const initialReserve = 10000
          await pool.deposit({ value: 1000 })
          const price = await pool.pricePurchase(1000, 3, 1);
          const coms = await pool.comsPurchase(1000, 3, 1);
          await pool.purchase(1000, 3, { value: price });
          const reserve = await pool.getReserve();
          assert.equal(reserve.sub(initialReserve).toString(), coms.toString());
        });
    });
});

describe('Claims Management', function () {
    let pool;

    beforeEach(async () => {
      const InsurancePool = await ethers.getContractFactory("InsurancePool");
      pool = await InsurancePool.deploy();
      await pool.deployed();
    });

    describe('Key Functions', function () {

        it('DeclareClaim', async () => {
          await pool.deposit({ value: 1000 })
          const price = await pool.pricePurchase(10, 3, 1);
          await pool.purchase(10, 3, { value: price });
          await pool.declareClaim();
          const totClaims = await pool.getTotalClaim();
          assert.equal(totClaims.toString(), 1);
        });

        it('setProductState', async () => {
          await pool.setProductState(true);
          bool = await pool.getClaimedDetails();
          assert.equal(bool, true);
        });

        it('PayClaim', async () => {
          await pool.deposit({ value: 1000 })
          const price = await pool.pricePurchase(100, 1, 1);
          await pool.purchase(100, 1, { value: price });
          await pool.setProductState(true);
          await pool.declareClaim();
          await pool.payClaim();
          balance = await ethers.provider.getBalance(pool.address)
          assert.equal(balance.toString(), 1000+1-100);
        });

        describe('Get functions', function () {

            it('getTotalPaid', async () => {
              await pool.deposit({ value: 1000 })
              const price = await pool.pricePurchase(100, 1, 1);
              await pool.purchase(100, 1, { value: price });
              await pool.declareClaim();
              await pool.setProductState(true);
              await pool.payClaim();
              const totalPaid = await pool.getTotalPaid();
              assert.equal(totalPaid.toString(), 100);
            });
        });
    });
});

describe('Final Test', function () {
    let pool;

    beforeEach(async () => {
      const InsurancePool = await ethers.getContractFactory("InsurancePool");
      pool = await InsurancePool.deploy();
      await pool.deployed();
    });

    it('Ready to deploy !', async () => {
      let ex;
      const price = await pool.pricePurchase(1000, 1, 1);
      const price2 = await pool.pricePurchase(100000000, 1, 1);


      await pool.deposit({ value: 10000 });
      console.log('Deposit -', 10000, '- OK');
      await pool.withdraw(100);
      console.log('Withdraw -', 10000, '- OK');
      try {
          await pool.withdraw(1000000);
      }
      catch (_ex) {
          ex = _ex;
      }
      assert(ex, );
      console.log('Withdraw -', 1000000, '- Not enough deposit');
      await pool.purchase(1000, 1, { value: price });
      console.log('Purchase -', 1000, '- OK');
      await pool.declareClaim();
      console.log('Declare Claim - OK');
      try {
          await pool.payClaim();
      }
      catch (_ex) {
          ex = _ex;
      }
      assert(ex, );
      console.log('Pay Claim - Your claim has not been confirmed');
      await pool.setProductState(true);
      console.log('setProductState - Product is now set to claimed state');
      await pool.payClaim();
      console.log('Pay Claim - 1000 ETH has been paid to the insured');
      const totalPaid = await pool.getTotalPaid();

      const myIns = await pool.getMyIns();
      console.log("Insured infos -", myIns.toString());
      const myClaim = await pool.getMyClaim();
      console.log("Claim infos -", myClaim.toString());

      assert.equal(totalPaid.toString(), 1000);
    });
});

// describe('Claims Management', function () {
//     let pool,
//
//     beforeEach(async () => {
//       // const ClaimsManagement = await ethers.getContractFactory("ClaimsManagement");
//       // claims = await ClaimsManagement.deploy();
//       // await claims.deployed();
//
//       const InsurancePool = await ethers.getContractFactory("InsurancePool");
//       pool = await InsurancePool.deploy();
//       await pool.deployed();
//
//       //const ipool = await ethers.getContractAt("IInsurancePool");
//     });
//
//     describe('Key Functions', function () {
//
//         it('DeclareClaim', async () => {
//           await pool.deposit({ value: 1000 })
//           const price = await pool.pricePurchase(10, 3, 1);
//           await pool.purchase(10, 3, { value: price });
//           await claims.declareClaim();
//           const totClaims = await claims.getTotalClaim();
//           assert.equal(totClaims.toString(), 1);
//         });
//
//     });
// });
