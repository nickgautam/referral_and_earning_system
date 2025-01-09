const BaseUrl = () => {
    const domain = window.location.hostname;
    console.log(window.location.hostname)

    if (domain === "localhost") {
        return "http://localhost:3000/";
    }
}