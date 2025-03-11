const { FusesPlugin } = require('@electron-forge/plugin-fuses');
const { FuseV1Options, FuseVersion } = require('@electron/fuses');

module.exports = {
  packagerConfig: {
    asar: true,  // Empacotar o aplicativo em um único arquivo .asar
  },
  rebuildConfig: {},
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      platforms: ['win32'],  // Garanta que a plataforma win32 esteja aqui
      config: {
        name: 'atacadinho',
        exe: 'Atacadinho.exe',
        authors: 'Turma de desenvolvimento de sistemas Senac 2023',
        noMsi: true,  // Impede a criação do arquivo .msi
      },
    },
    {
      name: '@electron-forge/maker-zip',
      platforms: ['darwin'],  // Definido para MacOS apenas
    },
    {
      name: '@electron-forge/maker-deb',
      config: {
        // Configurações específicas do maker-deb
      },
    },
    {
      name: '@electron-forge/maker-rpm',
      config: {
        // Configurações específicas do maker-rpm
      },
    },
  ],
  plugins: [
    {
      name: '@electron-forge/plugin-auto-unpack-natives',
      config: {},
    },
    new FusesPlugin({
      version: FuseVersion.V1,
      [FuseV1Options.RunAsNode]: false,
      [FuseV1Options.EnableCookieEncryption]: true,
      [FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false,
      [FuseV1Options.EnableNodeCliInspectArguments]: false,
      [FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: true,
      [FuseV1Options.OnlyLoadAppFromAsar]: true,
    }),
  ],
};
