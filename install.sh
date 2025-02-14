docker run --rm -ti \
  --user $(id -u):$(id -g) \
  --env ELECTRON_CACHE="/root/.cache/electron" \
  --env ELECTRON_BUILDER_CACHE="/root/.cache/electron-builder" \
  --env npm_config_platform=win32 \
  --env npm_config_arch=x64 \
  -v ${PWD}:/project \
  -v ~/.cache/electron:/root/.cache/electron \
  -v ~/.cache/electron-builder:/root/.cache/electron-builder \
  electronuserland/builder:wine \
  bash -c "cd /project && rm -rf node_modules && yarn cache clean && yarn install --check-files && yarn run build:win"
