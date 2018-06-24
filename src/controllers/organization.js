require('dotenv').config()

const uuidAPIKey = require('uuid-apikey');
const log = require('../libs/log')(module);
const ipInt = require('ip-to-int');
const ip = require('ip');
const Organization = require('../models/organization')
const config = require('../config/mongodb')
var ipaddr = ip.address();

function encodeIP(ipaddr) 
{
    try
    {
        return ipInt(ipaddr).toInt();
    }
    catch(err)
    {
        log.error(err)
    }
}

function genUUID()
{
    try
    {
        return uuidAPIKey.create()
    }
    catch(err)
    {
        log.error(err)
    }
    
}

exports.createOraganization = function (req, res) 
{   

    var organization = req.body.organization;
    var domain = req.body.domain;

    Organization.findOne({organization : organization, domain : domain}, (err, org) => {
        if (!req.body.domain) 
        {
            return res.status(400).send("Bad Request: Domain should be specified!")
        }

        if (!req.body.organization) 
        {
            return res.status(400).send("Bad Request: Organization should be specified!")
        }

        if (!req.body) 
        {
            return res.status(400).send("Bad Request")
        }

        if (err) 
        {
            log.error(err)
            return res.status(500).send("Internal Error")
        }
        if (org) 
        {   
            try 
            {
                var domain = org
                console.log(domain.domain)
                if (domain) {
                    return res.status(403).send('Domain exist')
                }
            } 
            catch(err)
            {
                console.log(err)
            }
            return res.status(403).send('Organization exist!')
        }
        
        else 
        {
            var org = new Organization({ 
        
                ip:             encodeIP(ipaddr),
                apikey:         genUUID().apiKey,
                uuid :          genUUID().uuid,
                domain :        req.body.domain,
                organization:   req.body.organization,
                uri :           'mongodb://localhost/' + req.body.domain
        
              });
        
            org.save(function(err, org) {
        
                if (err) 
                {   
                    log.error(err);
                    return res.status(500).send('Internal Error');
                } 
                else 
                {
                    log.info('Org saved successfully');
                    return res.json(
                        {
                            success : true,
                            apikey  : org.apikey,

                        });
                }
                
            });
        }
    })

}

exports.showOrganization = function (req, res)
{
    var organization = req.query.org;
    Organization.findOne({organization : organization}, (err, org) => {
        if (err) 
        {
            log.error(err);
            return res.status(500).send('Internal Error');
        }
        if (!org) 
        {
            return res.status(404).send('Not Found');
        }
        else 
        {
            return res.status(200).json(
                {
                    success : true,
                    apikey  : org.apikey,
                    ip      : ipInt(org.ip).toIP()
                }
            )
        }
    })
}

exports.deleteOrganization = function (req, res)
{   
    var organization = req.body.organization;
    Organization.findOneAndRemove({organization : organization}, (err, org) => {
        if (err) 
        {
            log.error(err);
            return res.status(500).send('Internal Error');
        }
        if (!org) 
        {
            log.info('Organization not exists');
            return res.status(404).send('Not Found')
        }
        else 
        {
            log.info('WARNING: ORGANIZATION REMOVED!')
            return res.status(410).send('Gone')
        }
    })
}


exports.key = function (req, res, next) 
{
    //сначала нужно принять ключ из x-api-token
    if (!req.headers['x-api-key']) 
    {
        return res.status(403).send('Unathorized: no key provided!'); 
    }    
    var key = req.headers['x-api-key']
    
    //потом нужно провалидирровать ключ

    if (uuidAPIKey.isAPIKey(key) === true) 
    {
        log.info(key + ' : is a valid key');

        //потом достать соответствующий ключ из БД
        Organization.findOne({apikey : key}, (err, data) => {
            if (err) 
            {
                return res.status(500).send('Internal Error: Something is wrong with DB!'); 
            }
            else
            {
                var uuid = uuidAPIKey.toUUID(data.apikey) //потом перевести его в uuid
                var reqUUID = uuidAPIKey.toUUID(key) //потом перевести key из запроса в uuid

                if (uuid === reqUUID) //затем сравнить его с uuid из базы 
                {   
                    log.info('Connecting to: ' + data.organization ) 

                    next()
                } 
                else 
                {
                    return res.status(403).send('Unathorized: key you provided does not exsist!');
                    log.error('USER PROVIDED EXPIRED OR NOT EXSISTING KEY!')
                }
            }
        })
    }
    else
    {
        log.error(key + ' : is an invalid key')
        return res.status(403).send('Unathorized: wrong key!');
    }
}

module.exports.encodeIP = encodeIP;
module.exports.genUUID = genUUID;

// /api/org

//TODO

//Save organization to common DB

    // On Organization creation check if organization exsists
        // if organization exsists send 403 Forbiden
    
    // On admin creation check if organization exsists
        // if organization not exsists send 404 Not Found
    
// if everything ok - use org name as db name and create new mongo connection
// Return domain, organization, and uuid in response


//Show organization on request by uuid
    // Return domain, organization, and uuid
    // if not exsist - send 404 not found

//Remove organization and all its DBs
    // if not exsist - send 404 not found
    // Return "ok, removed"
    // Close all DB connections
    // Remove databases and all org related tmp files

