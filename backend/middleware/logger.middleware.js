import colors from colors;

const logger = (req,res,next)=>{

    const methodColors = {
        'GET': 'green',
        'POST': 'blue',
        'PUT': 'yellow',
        'DELETE': 'red',
        'PATCH': 'magenta'
    }


    const color = methodColors[req.method]||'white';

    console.log(colors[color](`Request Method: ${req.method} | URL: ${req.url}`));
    next();
}