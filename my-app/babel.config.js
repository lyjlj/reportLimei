module.exports = {
  presets: ["@vue/cli-plugin-babel/preset"],
  plugins: [
    [
      "import",
      {
        libraryName: "vant",
        libraryDirectory: "es",
        style: true
      },
      "vant"
    ]
  ],
  css: {
    loaderOptions: {
      sass: {
        implementation: require("sass") // This line must in sass option
      }
    }
  }
};
