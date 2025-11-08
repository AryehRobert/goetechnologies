{ pkgs, ... }: {
  # Add your Nix packages here
  packages = [
    pkgs.firebase-tools
    pkgs.nodejs_20
  ];
  idx = {
    workspace = {
      onCreate = {
        npm-install = "npm install --prefix functions";
      };
    };
    previews = {
      enable = true;
      previews = {
        web = {
          # The command to start the web preview.
          # It must be a list of strings.
          command = [ "sh" "-c" "PORT=$PORT npm run start --prefix functions" ];
          manager = "web";
        };
      };
    };
  };
}
