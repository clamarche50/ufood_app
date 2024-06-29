export default class Restaurant {
  constructor(data) {
    this.id = data.id || '';
    this.name = data.name || '';
    this.address = data.address || '';
    this.tel = data.tel || '';
    this.location = data.location || {};
    this.openingHours = data.opening_hours || {};
    this.pictures = data.pictures || [];
    this.genres = data.genres || [];
    this.priceRange = data.price_range || 0;
    this.rating = data.rating || 0.0;
    this.reviews = data.reviews || [];
    this.visited = data.visited || false;
    this.priceSymbol = this.getPriceSymbol(data.price_range);
  }
  getPriceSymbol(priceRange) {
    switch (priceRange) {
      case 1:
        return '$';
      case 2:
        return '$$';
      case 3:
        return '$$$';
      case 4:
        return '$$$$';
      case 5:
        return '$$$$$'
      default:
        return '';
    }
  }
}
