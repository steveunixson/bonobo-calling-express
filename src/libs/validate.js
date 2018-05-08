function validateUpload(req, res) {
    if (!req.files.xlsx)
      return res.status(400).send('No files were uploaded.');
  
    if (!req.body.name)
      return res.status(400).send('No name was specified.');
    
    if (!req.body.type)
      return res.status(400).send('No type was specified.');
    
    if (!req.body.comment)
      return res.status(400).send('No comment was specified.');
    }

function validateSetupPost(req, res){
    if (!req.body.username)
    return res.status(400).send('No username was specified.');
    
  
    if (!req.body.organization)
    return res.status(400).send('No organization was specified.');
    
}

    module.exports.validateUpload = validateUpload;
    module.exports.validateSetupPost = validateSetupPost;