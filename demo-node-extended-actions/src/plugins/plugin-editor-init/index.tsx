import { ILowCodePluginContext } from '@alilc/lowcode-engine';
import { injectAssets } from '@alilc/lowcode-plugin-inject';
import assets from '../../services/assets.json';
import {
  getPageSchema,
} from '../../services/mockService';
const EditorInitPlugin = (ctx: ILowCodePluginContext, options: any) => {
  return {
    async init() {
      // 设置物料描述
      const { material, project, config } = ctx;
      const scenarioName = options['scenarioName'];
      const scenarioDisplayName = options['displayName'] || scenarioName;
      const scenarioInfo = options['info'] || {};
      // 保存在config中用于引擎范围其他插件使用
      config.set('scenarioName', scenarioName);
      config.set('scenarioDisplayName', scenarioDisplayName);
      config.set('scenarioInfo', scenarioInfo);

      await material.setAssets(await injectAssets(assets));
      const schema = await getPageSchema(scenarioName);

      console.log(`get schema for scenarioName ${scenarioName}:`, schema);
      // 加载 schema
      project.openDocument(schema);
    },
  };
}
EditorInitPlugin.pluginName = 'EditorInitPlugin';
EditorInitPlugin.meta = {
  preferenceDeclaration: {
    title: '保存插件配置',
    properties: [
      {
        key: 'scenarioName',
        type: 'string',
        description: '用于localstorage存储key',
      },
      {
        key: 'displayName',
        type: 'string',
        description: '用于显示的场景名',
      },
      {
        key: 'info',
        type: 'object',
        description: '用于扩展信息',
      }
    ],
  },
};
export default EditorInitPlugin;