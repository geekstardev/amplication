import {
  EventNames,
  Events,
  PluginInstallation,
  PluginMap,
} from "@amplication/code-gen-types";
import { join } from "path";
import { logger } from "./logging";

class EmptyClass {}

const functionsObject = ["[object Function]", "[object AsyncFunction]"];

/**
 * generator function that import the plugin requested by user
 * @param pluginList
 * @returns Plugin class
 */
async function* getPluginFuncGenerator(
  pluginList: PluginInstallation[],
  pluginInstallationPath?: string
): AsyncGenerator<new () => any> {
  try {
    const pluginListLength = pluginList.length;
    let index = 0;

    do {
      const localPackage = pluginList[index].settings?.local
        ? join("../../../../", pluginList[index].settings?.destPath)
        : undefined;
      const packageName = localPackage || pluginList[index].npm;

      const func = await getPlugin(
        packageName,
        localPackage ? undefined : pluginInstallationPath
      );

      ++index;
      if (!func.hasOwnProperty("default")) yield EmptyClass;

      yield func.default;
    } while (pluginListLength > index);
  } catch (error) {
    logger.error(error);
    return EmptyClass;
  }
}

async function getPlugin(
  packageName: string,
  customPath: string | undefined
): Promise<any> {
  if (!customPath) {
    try {
      return await import(packageName);
    } catch (error) {
      logger.error(error);
    }
  }
  const path = join(customPath, packageName);
  if (path) {
    return await import(path);
  }
}

/**
 * loop through all plugin list and set the plugin under each event
 */
const getAllPlugins = async (
  pluginList: PluginInstallation[],
  pluginInstallationPath?: string
): Promise<Events[]> => {
  if (!pluginList.length) return [];

  const pluginFuncsArr: Events[] = [];

  for await (const pluginFunc of getPluginFuncGenerator(
    pluginList,
    pluginInstallationPath
  )) {
    const initializeClass = new pluginFunc();
    if (!initializeClass.register) continue;

    const pluginEvents = initializeClass.register();
    if (Object.prototype.toString.call(pluginEvents) !== "[object Object]")
      continue;

    pluginFuncsArr.push(pluginEvents);
  }

  return pluginFuncsArr;
};

/**
 * main plugin manger function. it trigger plugin import and set the structure for plugin context
 */
const registerPlugins = async (
  pluginList: PluginInstallation[],
  pluginInstallationPath?: string
): Promise<{ [K in EventNames]?: any }> => {
  const pluginMap: PluginMap = {};

  const pluginFuncsArr = (await getAllPlugins(
    pluginList,
    pluginInstallationPath
  )) as Events[];
  if (!pluginFuncsArr.length) return {};

  pluginFuncsArr.reduce(
    (pluginContext: { [key: string]: any }, plugin: Events) => {
      Object.keys(plugin).forEach((eventKey: string) => {
        if (!pluginMap.hasOwnProperty(eventKey))
          pluginContext[eventKey as EventNames] = { before: [], after: [] };

        const { before, after } = plugin[eventKey as keyof Events] || {};

        functionsObject.includes(Object.prototype.toString.call(before)) &&
          pluginContext[eventKey].before.push(before);
        functionsObject.includes(Object.prototype.toString.call(after)) &&
          pluginContext[eventKey].after.push(after);
      });
      return pluginContext;
    },
    pluginMap
  );

  return pluginMap;
};

export default registerPlugins;