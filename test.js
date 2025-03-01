fetch("http://test.cpom/updateAddresss.html", {
    method: 'POST',
    mode: 'same-origin',
    credentials: 'same-origin',
    headers: {
        'Content-Type': 'application/json'
    },
    body: 'customId=dasd&dsad=true'
});