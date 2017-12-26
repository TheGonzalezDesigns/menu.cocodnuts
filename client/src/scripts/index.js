import css from '../styles/index.styl';
import bulma from 'bulma.styl';
import Vue from 'vue';
//import VueAxiosPlugin from 'vue-axios-plugin'

const vm = new Vue({
    el: "#app",
    data: {
        options: ["enter", "view"],
        name: "",
        category: "",
        price: "",
        photo: "",
        description: "",
        searchValue: "",
        item: "default",
        selection: "default",
        searchCategory: "default",
        menu: [],
        data: [],
        edit: {
            name: "",
            category: "",
            price: "",
            photo: "",
            description: ""
        },
        errors: [],
        errorCodes: [0, 0, 0, 0, 0], //ltr mirrors ttb
        disabledPreview: true,
        disabledErrors: true,
        disabledSearchInput: true,
        disabledSearchButton: true,
        disabledReviewButton: true,
        disabledReplaceButton: true,
        showSubmitButton: true,
        hideReplaceButton: true,
        overflow: true,
        showTitle: false,
        alert: {
            show: false,
            class: "",
            type: "",
            message: "",
            title: ""
        }
    },
    methods: {
        disability() {
            const disability =
                  this.name &&
                  this.category &&
                  this.price &&
                  this.photo &&
                  this.description
            ? false
            : true;
            this.disabledReviewButton = disability;
            this.disabledReplaceButton = disability;
        },
        getData() {
            return {
                name: this.name,
                category: this.category,
                price: this.price,
                photo: this.photo,
                description: this.description
            };
        },
        setData(data) {
            this.name = data.name;
            this.category = data.category;
            this.price = data.price;
            this.photo = data.photo;
            this.description = data.description;
        },
        eraseData() {
            this.name = "";
            this.category = "";
            this.price = "";
            this.photo = "";
            this.description = "";
        },
        previewData(showSubmitButton = true) {
            document.activeElement.blur();
            this.disabledPreview = false;
            this.showSubmitButton = showSubmitButton;
        },
        hidePreview() {
            this.disabledPreview = true;
            this.showSubmitButton = true;
        },
        pushData() {
            const data = this.getData();
            this.menu.push(data);
        },
        reviewData(searchForCopies = true) {
            const data = this.getData();
            const check = this.checkData(searchForCopies);
            if (check.valid) {
                this.previewData();
            } else this.showErrors(check.why);
        },
        publishData() {
            this.pushData();
            this.resetData(true);
            this.updateFile();
        },
        checkData(searchForCopies = true) {
            var errors = [];
            var instance = 0;
            var check = {
                valid: true,
                why: []
            };
            const priceRegExp = new RegExp("^\\d+(.\\d{1,2})?$", "g");
            const photoRegExp = new RegExp(
                "^" +
                // protocol identifier
                "(?:(?:https?|ftp)://)" +
                // user:pass authentication
                "(?:\\S+(?::\\S*)?@)?" +
                "(?:" +
                // IP address exclusion
                // private & local networks
                "(?!(?:10|127)(?:\\.\\d{1,3}){3})" +
                "(?!(?:169\\.254|192\\.168)(?:\\.\\d{1,3}){2})" +
                "(?!172\\.(?:1[6-9]|2\\d|3[0-1])(?:\\.\\d{1,3}){2})" +
                // IP address dotted notation octets
                // excludes loopback network 0.0.0.0
                // excludes reserved space >= 224.0.0.0
                // excludes network & broacast addresses
                // (first & last IP address of each class)
                "(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])" +
                "(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}" +
                "(?:\\.(?:[1-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))" +
                "|" +
                // host name
                "(?:(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)" +
                // domain name
                "(?:\\.(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)*" +
                // TLD identifier
                "(?:\\.(?:[a-z\\u00a1-\\uffff]{2,}))" +
                // TLD may end with dot
                "\\.?" +
                ")" +
                // port number
                "(?::\\d{2,5})?" +
                // resource path
                "(?:[/?#]\\S*)?" +
                "$",
                "i"
            );
            if (searchForCopies) {
                if (this.menu.length)
                    this.menu.forEach(
                        item => (item.name == this.name ? instance++ : 0)
                    );
                if (instance) {
                    errors.push(
                        instance +
                        " item(s) with the same name already exist(s)."
                    );
                    this.errorCodes[0]++;
                }
            }
            if (this.name.length < 3) {
                errors.push("The length of the name is too short.");
                this.errorCodes[0]++;
            }
            if (this.category.length < 3) {
                errors.push("The length of the category is too short.");
                this.errorCodes[1]++;
            }
            if (this.price.match(priceRegExp) === null) {
                errors.push("The price is incorrectly written.");
                this.errorCodes[2]++;
            }
            if (this.photo.match(photoRegExp) === null) {
                errors.push("The url of the photo is incorrectly written.");
                this.errorCodes[3]++;
            }
            if (this.description.length < 3) {
                errors.push("The length of the description is too short.");
                this.errorCodes[4]++;
            }
            check.valid = !errors.length ? true : false;
            check.why = errors;

            return check;
        },
        resetData(hardReset = false) {
            if (hardReset) {
                //Does not reset the menu
                this.eraseData();
                this.resetErrors();
            } else if (this.errorCodes.length) {
                if (this.errorCodes[0]) this.name = "";
                if (this.errorCodes[1]) this.category = "";
                if (this.errorCodes[2]) this.price = "";
                if (this.errorCodes[3]) this.photo = "";
                if (this.errorCodes[4]) this.description = "";
                this.resetErrors();
            }
            this.showSubmitButton = true;
            this.disabledReviewButton = true;
            this.disabledReplaceButton = true;
            this.disabledPreview = true;
            this.disabledErrors = true;
            this.overflow = true;
        },
        toggleBodyOverflow() {
            this.overflow = !this.overflow;
            document.body.className =
                (this.overflow ? "show" : "hide") + "Overflow";
        },
        redisable() {
            this.resetData();
            this.toggleBodyOverflow();
        },
        search() {
            const check = this.checksearch();
            if (check.valid) {
                this.data = this.menu.filter(
                    item => item[this.searchCategory] == this.searchValue
                );
                if (!this.data.length) {
                    this.searchValue = "None found.";
                }
            } else {
                this.showErrors(check.why);
                this.searchValue = "";
                this.resetList();
            }
        },
        checksearch() {
            var errors = [];
            var check = {
                valid: true,
                why: []
            };
            const priceRegExp = new RegExp("^\\d+(.\\d{1,2})?$", "g");
            this.resetErrors();
            if (
                this.searchCategory == "name" ||
                this.searchCategory == "description" ||
                this.searchCategory == "category"
            ) {
                if (this.searchValue.length < 3) {
                    errors.push("The length of the search is too short.");
                }
            }
            if (this.searchCategory == "price") {
                if (this.searchValue.match(priceRegExp) === null) {
                    errors.push("The price is incorrectly written.");
                }
            }
            check.valid = !errors.length ? true : false;
            check.why = errors;

            return check;
        },
        resetErrors() {
            this.errors = [];
            this.errorCodes = [0, 0, 0, 0, 0];
        },
        showErrors(errors) {
            document.activeElement.blur();
            this.errors = errors;
            this.toggleBodyOverflow();
            this.disabledErrors = false;
        },
        enableSearch() {
            this.disabledSearchInput = this.searchCategory == "default";
            this.disabledSearchButton = this.searchValue ? false : true;
        },
        capatalize(text) {
            return text.charAt(0).toUpperCase() + text.slice(1);
        },
        editData() {
            this.setData(this.getItem());
            this.hideReplaceButton = false;
            this.switchSelection("enter");
        },
        replaceData() {
            this.reviewData(false);
        },
        switchSelection(choice) {
            this.selection = choice;
        },
        deleteData() {
            this.menu.splice(this.index, 1);
            this.search();
        },
        setIndex() {
            this.index = this.item != "default" ? parseInt(this.item) : -1;
        },
        getItem() {
            const index = this.index;
            const data = this.menu[index];
            return data;
        },
        setItem() {
            this.setData(this.getItem());
        },
        resetSearch() {
            this.searchCategory = "default";
            this.searchValue = "";
            this.disabledSearchInput = true;
            this.disabledSearchButton = true;
            this.resetList();
            console.log("resetSearch executed!");
        },
        resetList() {
            this.item = "default";
            this.data = [];
        },
        republishData() {
            this.deleteData();
            this.publishData();
            this.cancelData();
        },
        cancelData() {
            this.hideReplaceButton = true;
            this.eraseData();
        },
        updateFile() {
           /* axios.post('/update', this.menu).then(response => {
                if(response.status === 404){
                    vm._alert("Could not connect to server. Reload page.", "danger");
                }
                if(response.status === 500){
                    vm._alert("Could not publish data to server. Reload page.", "danger");
                }
                return response
            }).catch(error => {
                vm._alert(error, "danger");
            });*/
        },
        _alert(message, type) {
            this.alert.message = message;
            switch (type) {
                case "successful":
                    this.alert.class = "is-primary";
                    this.alert.title = "Success";
                    break;
                case "danger":
                    this.alert.class = "is-danger";
                    this.alert.title = "Danger";
                    break;
                case "warning":
                    this.alert.class = "is-warning";
                    this.alert.title = "Warning";
                    break;
                default:
                    this.alert.class = "is-info";
                    this.alert.title = "Attention";
            }
            this.alert.show = true;
            setTimeout(function() {
                vm.alert.show = false;
            }, 2000);
        }
    },
    watch: {
        name() {
            this.disability();
            this.name = this.name.toLowerCase();
        },
        category() {
            this.disability();
            this.category = this.category.toLowerCase();
        },
        price() {
            this.disability();
        },
        photo() {
            this.disability();
        },
        description() {
            this.disability();
        },
        searchValue() {
            this.enableSearch();
            this.searchValue = this.searchValue.toLowerCase();
            this.resetList();
        },
        searchCategory() {
            this.enableSearch();
            this.disability();
            if (this.searchValue == "none found.") this.searchValue = "";
            this.resetList();
        },
        item() {
            if (this.data.length) {
                this.setIndex();
                this.setItem();
            }
        },
        menu() {
            this.menu.forEach(function(item, index) {
                item.index = index;
            });
        },
        selection() {
            this.resetData();
            this.resetSearch();
        }
    },
});
global.vm = vm;
setTimeout(function() {
    vm.showTitle = true;
}, 2000);

/*const checkStatus = (response) => {
    if(response.status === 404){
        vm._alert("Could not connect to server. Reload page.", "danger");
    }
    if(response.status === 500){
        vm._alert("Could not publish data to server. Reload page.", "danger");
    }
    return response
}

Vue.use(VueAxiosPlugin, {
    checkStatus: checkStatus
})*/
