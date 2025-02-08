import Swal from "sweetalert2";

const getCSSVariable = (variable) =>
  getComputedStyle(document.documentElement).getPropertyValue(variable).trim();

const showDialog = {
  confirm: async (message) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: message,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: getCSSVariable("--primary-color"),
      cancelButtonColor: getCSSVariable("--secondary-color"),
      confirmButtonText: "Yes, proceed!",
      cancelButtonText: "No, cancel!",
    });
    return result.isConfirmed;
  },

  showMessage: (message, type) => {
    Swal.fire({
      icon: type,
      title: type === "success" ? "Success!" : "Oops!",
      text: message,
      confirmButtonColor: getCSSVariable("--highlight-color"),
    });
  },
};

export default showDialog;
