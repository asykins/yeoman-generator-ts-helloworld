const Generator = require("yeoman-generator");

/**
 * This is the default loop used by the Yeoman Generator
 * Every methods are running in order
 * If you find yourself writing custom methods, those will be executed
 * between the configuring and writing methods
 * Notes :
 * function are public by default
 * to make a private method, prefix with _
 */
module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);

    this.argument("appname", {
      type: String,
      default: "my-app",
      optional: true,
      description: "Describe the name bound to the package.json",
    });
    this.option("install", {
      type: Boolean,
      optional: true,
      default: false,
      description: "Shortcut for the --install option",
    });
    this.option("run", {
      type: Boolean,
      optional: true,
      default: false,
      description: "Shortcut for the run option",
    });
    this.option("git", {
      type: Boolean,
      optional: true,
      default: false,
      description: "Shortcut for gitinit"
    })
  }
  writing() {
    this.fs.copy(this.templatePath("src"), this.destinationPath("src"));
    this.fs.copyTpl(
      this.templatePath("_package.json"),
      this.destinationPath("package.json"),
      {
        appname: this.options.appname,
      }
    );
    this.fs.copy(
      this.templatePath("_tsconfig.json"),
      this.destinationPath("tsconfig.json")
    );
    if(this.options.git) {
        this.fs.copy(
          this.templatePath("_.gitignore"),
          this.destinationPath(".gitignore")
        );
    }
    this.fs.copy(
      this.templatePath("_readme.md"),
      this.destinationPath("readme.md")
    );
  }
  install() {
    if (this.options.install) {
      this.log("Running npm install");
      this.npmInstall();
    }
  }
  end() {
    if(this.options.git)
    {
      this.log("Initializing local git repo");
      this.spawnCommandSync("git init");
    }
    if (this.options.run) {
      if (!(this.options.install)) {
        this.log("Running npm install");
        this.spawnCommandSync("npm install");
      }
      this.log("Running the application");
      this.spawnCommandSync("npm run clean && npm run start");
    }
  }
};
