const axios = require('axios')

class Sky {
  constructor (config) {
    this.apiKey = config.skyScanner.apiKey
  }

  getLocals () {
    return axios.get(`http://partners.api.skyscanner.net/apiservices/reference/v1.0/locales?apiKey=${this.apiKey}`)
  }

  getCheapFlights ({market, currency, locale, originPlace, destinationPlace, outboundPartialDate, inboundPartialDate}) {
    console.log(`http://partners.api.skyscanner.net/apiservices/browsequotes/v1.0/${market}/${currency}/${locale}/${originPlace}/${destinationPlace}/${outboundPartialDate}/${inboundPartialDate}?apiKey=${this.apiKey}`)
    return axios.get(`http://partners.api.skyscanner.net/apiservices/browsequotes/v1.0/${market}/${currency}/${locale}/${originPlace}/${destinationPlace}/${outboundPartialDate}/${inboundPartialDate}?apiKey=${this.apiKey}`)
  }

  getLocationAutoSuggest ({q, callback, market, currency, locale}) {
    return axios.get(`http://partners.api.skyscanner.net/apiservices/xd/autosuggest/v1.0/${market}/${currency}/${locale}/?apikey=${this.apiKey}&query=${q}&callback=${callback}`)
  }

  getAnywhereFlights ({q, callback, market, currency, locale, originPlace, outboundPartialDate}) {
    return axios.get(`http://api.skyscanner.net/apiservices/browsequotes/v1.0/${market}/${currency}/${locale}/${originPlace}/anywhere/${outboundPartialDate}?apikey=${this.apiKey}`)
    // UK/GBP/en-GB/EDI-iata/anywhere/2016-11?apikey=lt187149402913642631939313133483
  }
}

module.exports = Sky
