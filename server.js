//in this project we are using openweathermap
//https://api.openweathermap.org/data/2.5/weather?q=Sirsilla&appid=a3547addf902f2a1e709f062a2e801dd
//now we need to use the requests package 
//for routing we are using requests npm module


const http = require('http')
const fs = require('fs')
const requests = require("requests")

const homeFile = fs.readFileSync("main.html", "utf-8")

//now we need to replace the old html file with new values coming from api
//we can replace the values using replace method we used convention {%%} that values we need to get and replace
//we know we can get that values in this oldvalue(home file) so we can access those values which we want to replace
const covertToCelcius = (value) => {
    const celcius = (value - 273)
    let roundNumber = Math.round(celcius*100)/ 100
    return roundNumber
}
const replaceValues = (oldValue, newValue) => {
    let temp = oldValue.replace("{%tempVal%}", covertToCelcius(newValue.main.temp))
    temp = temp.replace("{%cityName%}", newValue.name)
    temp = temp.replace("{%country%}", newValue.sys.country)
    temp = temp.replace("{%tempMin%}", covertToCelcius(newValue.main.temp_min))
    temp = temp.replace("{%tempMax%}", covertToCelcius(newValue.main.temp_max))
    temp = temp.replace("{%humidity%}", newValue.main.humidity)
    temp = temp.replace("{%tempStatus%}", newValue.weather[0].main)
    return temp
}


const server = http.createServer((req, res) => {
    if(req.url === "/"){
        //we are using requests package for routing
        requests('https://api.openweathermap.org/data/2.5/weather?q=Sirsilla&appid=a3547addf902f2a1e709f062a2e801dd')
        .on('data', function (chunk) {
        const parseData = JSON.parse(chunk) //converting to object
        const arrData = [parseData] //we are storing this object into array
            const updateData = arrData.map(val => replaceValues(homeFile, val)).join("") //here we get the data in array format so we need to join it
            res.write(updateData)
        })
        .on('end', function (err) {
        if (err) return console.log('connection closed due to errors', err);
        res.end()
        });
    }

})

server.listen(5000, () => {
    console.log(`server running at http://localhost:5000`)
})