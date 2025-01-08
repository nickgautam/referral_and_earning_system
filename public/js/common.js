const BaseUrl = () => {
    const domain = window.location.hostname.split(".").slice(-2)[1];

    if (domain === "localhost") {
        return "http://wocollp.localhost:3000/";
    }
}