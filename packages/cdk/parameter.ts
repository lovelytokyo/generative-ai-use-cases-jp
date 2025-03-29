import * as cdk from 'aws-cdk-lib';
import {
  StackInput,
  stackInputSchema,
  ProcessedStackInput,
} from './lib/stack-input';
import { ModelConfiguration } from 'generative-ai-use-cases-jp';

// CDK Context からパラメータを取得する場合
const getContext = (app: cdk.App): StackInput => {
  const params = stackInputSchema.parse(app.node.getAllContext());
  return params;
};

// パラメータを直接定義する場合
const envs: Record<string, Partial<StackInput>> = {
  // 必要に応じて以下をカスタマイズ
  // paramter.ts で無名環境を定義したい場合は以下をアンコメントすると cdk.json の内容が無視され、parameter.ts がより優先されます。
  // '': {
  //   // 無名環境のパラメータ
  //   // デフォルト設定を上書きしたいものは以下に追記
  // },
  dev: {
    // 開発環境のパラメータ
    ragEnabled: true
  },
  staging: {
    // ステージング環境のパラメータ
    ragEnabled: true
  },
  prod: {
    // 本番環境のパラメータ
    dashboard: true,
    ragEnabled: true,
    flows: [
      {
        flowId: 'ABLQG0KQW3',
        aliasId: 'my-flow',
        flowName: 'flow-sample',
        description: '任意のキーワードをウェブ検索して、説明を返すフローです。文字を入力してください',
      },
    ],
    "allowedSignUpEmailDomains": ["amazon.com"],
    modelIds: [
      "anthropic.claude-3-5-sonnet-20241022-v2:0",
      "anthropic.claude-3-5-sonnet-20240620-v1:0",
      "anthropic.claude-3-opus-20240229-v1:0",
      "anthropic.claude-3-sonnet-20240229-v1:0",
      "anthropic.claude-3-haiku-20240307-v1:0",
      "us.anthropic.claude-3-5-sonnet-20240620-v1:0",
      "us.anthropic.claude-3-opus-20240229-v1:0",
      "us.anthropic.claude-3-sonnet-20240229-v1:0",
      "us.anthropic.claude-3-haiku-20240307-v1:0",
      "eu.anthropic.claude-3-5-sonnet-20240620-v1:0",
      "eu.anthropic.claude-3-sonnet-20240229-v1:0",
      "eu.anthropic.claude-3-haiku-20240307-v1:0",
      "apac.anthropic.claude-3-haiku-20240307-v1:0",
      "apac.anthropic.claude-3-sonnet-20240229-v1:0",
      "apac.anthropic.claude-3-5-sonnet-20240620-v1:0",
      "apac.anthropic.claude-3-5-sonnet-20241022-v2:0",
      "us.meta.llama3-2-90b-instruct-v1:0",
      "us.meta.llama3-2-11b-instruct-v1:0",
      "amazon.nova-pro-v1:0",
      "amazon.nova-lite-v1:0",
      "us.amazon.nova-pro-v1:0",
      "us.amazon.nova-lite-v1:0",
      "eu.amazon.nova-pro-v1:0",
      "eu.amazon.nova-lite-v1:0",
      "apac.amazon.nova-pro-v1:0",
      "apac.amazon.nova-lite-v1:0"
    ]
  },
  // 他環境も必要に応じてカスタマイズ
};

// 後方互換性のため、CDK Context > parameter.ts の順でパラメータを取得する
export const getParams = (app: cdk.App): ProcessedStackInput => {
  // デフォルトでは CDK Context からパラメータを取得する
  let params = getContext(app);

  // env が envs で定義したものにマッチ場合は、envs のパラメータを context よりも優先して使用する
  if (envs[params.env]) {
    params = stackInputSchema.parse({
      ...envs[params.env],
      env: params.env,
    });
  }
  //modelIds, imageGenerationModelIdsのフォーマットを揃える
  const convertToModelConfiguration = (
    models: (string | ModelConfiguration)[],
    defaultRegion: string
  ): ModelConfiguration[] => {
    return models.map((model) =>
      typeof model === 'string'
        ? { modelId: model, region: defaultRegion }
        : model
    );
  };

  return {
    ...params,
    modelIds: convertToModelConfiguration(params.modelIds, params.modelRegion),
    imageGenerationModelIds: convertToModelConfiguration(
      params.imageGenerationModelIds,
      params.modelRegion
    ),
    videoGenerationModelIds: convertToModelConfiguration(
      params.videoGenerationModelIds,
      params.modelRegion
    ),
  };
};
