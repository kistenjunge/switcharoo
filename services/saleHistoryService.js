'use strict';
const Sale = require('../models/Sale');
const db = require('diskdb');

function HistoryEntry(nsuid) {
    this.nsuid = nsuid;
    this.lowestPrice = undefined;
    this.sales = [];
}

HistoryEntry.fromDbEntry = function(dbEntry) {
    return dbEntry && Object.assign(new HistoryEntry(dbEntry.nsuid), dbEntry);
};

HistoryEntry.prototype.addSale = function(sale) {
        this.sales.push(sale);
        this.lowestPrice = this.getLowestPrice();
};

HistoryEntry.prototype.hasSale = function(saleToLookFor) {
    return this.sales.some( sale => saleToLookFor.matchesSale(sale));
};

HistoryEntry.prototype.getLowestPrice = function() {
    return this.sales.map(sale => sale.price).reduce( function (a,b) {
        return Math.min(a, b);
    }, Number.MAX_VALUE);
};

HistoryEntry.prototype.totalSales = function() {
  return this.sales.length;
};

module.exports = () => {
    return {
        db: db.connect('./data', ['history']),

        getAllHistoryEntires: () => {
            return db.history.find();
        },

        getHistoryEntryByNsuid: (nsuid) => {
            return db.history.findOne({ nsuid: nsuid});
        },

        addSale: (nsuid, sale) => {
            const entry = db.history.findOne({ nsuid: nsuid});
            if (entry == undefined) {
                let entryToAdd = new HistoryEntry(nsuid);
                entryToAdd.addSale(sale);
                db.history.save(entryToAdd);
                console.log('history entry added ' + entryToAdd.nsuid);
            }
            else {
                let entryToUpdate = HistoryEntry.fromDbEntry(entry);
                if (!entryToUpdate.hasSale(sale)) {
                    entryToUpdate.addSale(sale);
                    let query = {
                        _id: entry._id
                    };
                    let update = {
                        sales: entryToUpdate.sales,
                        lowestPrice: entryToUpdate.lowestPrice
                    };
                    db.history.update(query, update);
                    console.log('sale added for history entry ' + entryToUpdate.nsuid);
                }
                else
                    console.log('sale already stored for history entry ' + entry.nsuid)
            }
        }
    }
};