import sync from '@/api/sync'

const file = './menu.json'

function get() {
    sync.getData(file)
    console.log("Retrieving file...")
}
function publish(data) {
    console.log("Publishing file...")
    sync.setData(file, data, err => {
        const msg = err ? "Publish failed." : "Publish succeeded";
        console.log(msg);
    })
}

exports.get = get;
exports.publish = publish;
