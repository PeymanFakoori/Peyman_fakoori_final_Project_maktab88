$(() => {
  $("#delete-user").on("submit", function (e) {
    e.preventDefault();

    fetch(`/user/:username`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        document.location.pathname = "/user/login";
      });
  });
});
