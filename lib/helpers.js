'use strict';
import URL from 'url-parser';

class urlHelper{
    constructor(){
        this.domains = [];
    }

    isAuthorizedUrl(urlToTest){
        const url = new URL(urlToTest);
        return (this.domains.find((elem) => {
            return url.hostname === elem;
        }));
    }
}

export {
    urlHelper
};