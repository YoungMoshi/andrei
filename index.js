const axios = require('axios');

var prevco = 0;
var kph = 0;
var kphm = 0;
var kphh = 0;
var avbc = 0;
var lstupgrprice = 0;

const token = '1713656075913fNLtFED4wGCHwDUUmhxTrm2z0ZB2Mq1MI9ZXUdom1xQtWR15O7IMKslusGtaWEUP773966155';

async function claimReq() {
    const url = 'https://api.hamsterkombat.io/clicker/tap';

    const data = {
        availableTaps: 1000,
        count: 500,
        timestamp: Math.floor(Date.now() / 1000)
    };

    const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1'
    };

    try {
        const response = await axios.post(url, data, { headers });
        console.clear();
        var numb = response.data.clickerUser.balanceCoins;
        var totl = response.data.clickerUser.totalCoins;
        var lvl = response.data.clickerUser.level;
        kph = (numb.toFixed(2) - prevco)/15;
        kphh = (numb.toFixed(2) - prevco)*240;
        kphm = (numb.toFixed(2) - prevco)*4;
        console.log('\x1b[37mCoins now avaible:\x1b[38;5;47m', numb.toFixed(2),'\x1b[37m, Total coins:\x1b[38;5;47m', totl.toFixed(2),'\x1b[37m, Hamster level:\x1b[38;5;47m', lvl.toFixed(0),'/ 9','\x1b[37m, Coins KPH:\x1b[38;5;47m', kph.toFixed(2)+'/sec '+ kphh.toFixed(2) +'/h '+ kphm.toFixed(2) +'/min','\x1b[37m, Last upgrade cost:\x1b[38;5;47m', lstupgrprice.toFixed(2));
        prevco = numb.toFixed(2);
        avbc = numb.toFixed(2);
    } catch (error) {
        console.error('Error:', error.message);
    }
}

async function upgradeReq() {
    const url = 'https://api.hamsterkombat.io/clicker/upgrades-for-buy';
    const data = {};
    const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1'
    };

    try {
        const response = await axios.post(url, data, { headers });
        const upgrades = response.data.upgradesForBuy;
        const sections = response.data.sections;

        let lowestPrice = Infinity;
        let goodId = null;

        upgrades.forEach(upgrade => {
            if (upgrade.isAvailable && upgrade.price < lowestPrice) {
                const section = sections.find(sec => sec.section === upgrade.section);
                if (section && section.isAvailable) {
                    lowestPrice = upgrade.price;
                    goodId = upgrade.id;
                }
            }
        });
        upgpushReq(goodId, lowestPrice);
    } catch (error) {
        console.error('Error:', error.message);
    }
}

async function upgpushReq(avid, prices) {
    const url = 'https://api.hamsterkombat.io/clicker/buy-upgrade';

    const data = {
        timestamp: Math.floor(Date.now() / 1000),
        upgradeId: avid
    };

    const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1'
    };

    if (avbc >= prices) {
        try {
            const response = await axios.post(url, data, { headers });
            lstupgrprice = prices;
            console.log('\x1b[37mUPGRADED:\x1b[38;5;47m', avid,'Price:',prices);
        } catch (error) {
            console.error('Error:', error.message);
        }
    }
    else {
        console.error('\x1b[31mNOT AVB BALANCE TO UPGRD!');
    }
}

setInterval(() => {
    claimReq();
}, 15000);

setInterval(() => {
    upgradeReq();
}, 70000);