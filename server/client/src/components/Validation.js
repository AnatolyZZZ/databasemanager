export const validateCell = (params) => {
    if (!params.value || params.value === "") {
      return { error: true, helperText: "This field is required" };
    }
}