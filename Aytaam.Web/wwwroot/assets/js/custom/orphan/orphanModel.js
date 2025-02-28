function getOrphans(formData) {
    console.log("Sending FormData:", Object.fromEntries(formData)); // Debugging

    return $.ajax({
        url: "/Home/GetOrphans",
        type: "POST",
        processData: false,  // Important for FormData
        contentType: false,  // Important for FormData
        data: formData,
        dataType: "json",
        success: function (response) {
            console.log("Response Data:", response);
        },
        error: function (xhr, status, error) {
            console.error("Request Failed:", xhr.responseText || error);
        }
    });
}

