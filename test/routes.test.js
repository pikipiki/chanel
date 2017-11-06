'use strict';

import {expect} from 'chai';
import require from 'request';




it('Main page content', function() {
    request('http://localhost:3000', (error, response, body) => {
        expect(body).to.equal('Hello World');
    });
});

////////////