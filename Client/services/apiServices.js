class Api_Service {
    get_Api_Promise() {
        const get_Api_Promise = axios({
            url: "https://68ff11efe02b16d1753c5106.mockapi.io/LapTopInfo",
            method: "GET",
        });
        return get_Api_Promise;
    }

    get_LaptopInfo_By_ID(id) {
        const get_Product_Request = axios({
            url: `https://68ff11efe02b16d1753c5106.mockapi.io/LapTopInfo/${id}`,
            method: "GET",
        });
        return get_Product_Request;
    }
}
export default Api_Service;