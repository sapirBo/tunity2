const dateTime = require('date-time');
var express = require('express');
var app = express();

app.use(express.json());

var totalPrevReq = 0;

const prev_array = [
	{ name: 'prev', last_ip: 'not exist'}
];

const ip_addr = [
];

app.get('/prev', (req, res) => {
	handleIP(req.ip, 1);
	var current_ip = prev_array[0].last_ip;
	prev_array[0].last_ip = req.ip;
	totalPrevReq++;
	res.send(current_ip);
});

app.get('/total', (req, res) => {
	handleIP(req.ip, 0);
	res.json(totalPrevReq);	
});

app.get('/stats', (req, res) => {
	handleIP(req.ip, 0);
	res.send(ip_addr);
});

function handleIP (ip ,prev){
	var date = dateTime(); 
	var obj = ip_addr.find(c => c.ip === ip);
	if(!obj)
	{
		var new_ip = {
			ip: ip,
			first_access_date: date,
			last_access_date : date,
			num_of_prev : prev
		};
		ip_addr.push(new_ip);
	}
	else
	{
		obj.last_access_date = date;
		if(prev == 1)
		{
			obj.num_of_prev++;
		}
	}
};

var port = process.env.PORT || 3000;
app.listen(port, () => console.log(`listening to port ${port}..`));