function Sale(price, start, end) {
    this.price = price;
    this.start = start;
    this.end = end;
}

Sale.prototype.matchesSale = function (sale) {
    return (this.price == sale.price && this.start == sale.start && this.end == sale.end);
};

module.exports = Sale;