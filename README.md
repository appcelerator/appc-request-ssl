# Appcelerator Request SSL

This library is based off of [request-ssl](https://github.com/jhaynie/request-ssl).

This library when used, will add all the external HTTPS SSL certificate fingerprints for domains used by Appcelerator software (Node.JS based).


## How to update

- Update `DOMAINS` in generate.js
- run `node ./generate` to generate the updated fingerprints
- run `grunt`
- if everything works good and all tests passed, release this module to npm and make sure dependent packages get updated

## How to use

Use the same as `request-ssl` and `request`.  Same exact API.


## Legal

This code is closed source and Confidential and Proprietary to Appcelerator, Inc. All Rights Reserved.  This code MUST not be modified, copy or otherwise redistributed without expression written permission of Appcelerator. This file is licensed as part of the Appcelerator Platform and governed under the terms of the Appcelerator license agreement.  Your right to use this software terminates when you terminate your Appcelerator subscription.
