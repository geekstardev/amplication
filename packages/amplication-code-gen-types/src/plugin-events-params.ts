import { namedTypes } from "ast-types";
import { JsonValue } from "type-fest";
import {
  Entity,
  EntityField,
  PrismaClientGenerator,
  PrismaDataSource,
  ServiceTopics,
} from "./code-gen-types";
import { EventParams } from "./plugins-types";

export interface CreateEntityServiceBaseParams extends EventParams {
  before: {
    entityName: string;
    entity: Entity;
    templateMapping: { [key: string]: any };
    passwordFields: EntityField[];
    serviceId: namedTypes.Identifier;
    serviceBaseId: namedTypes.Identifier;
    delegateId: namedTypes.Identifier;
    template: namedTypes.File;
  };
}

export interface CreateEntityServiceParams extends EventParams {
  before: {
    entityName: string;
    templateMapping: { [key: string]: any };
    passwordFields: EntityField[];
    serviceId: namedTypes.Identifier;
    serviceBaseId: namedTypes.Identifier;
    template: namedTypes.File;
  };
}
export interface CreateEntityControllerParams extends EventParams {
  before: {
    templatePath: string;
    entityName: string;
    entityServiceModule: string;
    templateMapping: { [key: string]: any };
    controllerBaseId: namedTypes.Identifier;
    serviceId: namedTypes.Identifier;
  };
}
export interface CreateEntityControllerBaseParams extends EventParams {
  before: {
    baseTemplatePath: string;
    entity: Entity;
    entityName: string;
    entityType: string;
    entityServiceModule: string;
    templateMapping: { [key: string]: any };
    controllerBaseId: namedTypes.Identifier;
    serviceId: namedTypes.Identifier;
  };
}
export interface CreateAuthModulesParams extends EventParams {
  before: {
    srcDir: string;
  };
}

export interface CreateAdminModulesParams extends EventParams {
  before: {};
}

export type VariableDictionary = {
  [variable: string]: string;
}[];

export interface CreateServerDotEnvParams extends EventParams {
  before: {
    envVariables: VariableDictionary;
  };
}

export interface CreateServerDockerComposeParams extends EventParams {
  before: {
    fileContent: string;
    updateProperties: { [key: string]: any }[];
    outputFileName: string;
  };
}

export interface CreateServerDockerComposeDBParams extends EventParams {
  before: {
    fileContent: string;
    updateProperties: { [key: string]: any }[];
    outputFileName: string;
  };
}
export interface CreatePrismaSchemaParams extends EventParams {
  before: {
    entities: Entity[];
    dataSource: PrismaDataSource;
    clientGenerator: PrismaClientGenerator;
  };
}

export interface CreateMessageBrokerParams extends EventParams {
  before: {};
}
export interface CreateMessageBrokerTopicsEnumParams extends EventParams {
  before: {};
}
export interface CreateMessageBrokerNestJSModuleParams extends EventParams {
  before: {};
}
export interface CreateMessageBrokerClientOptionsFactoryParams
  extends EventParams {
  before: {};
}

export interface CreateMessageBrokerServiceParams extends EventParams {
  before: {};
}
export interface CreateMessageBrokerServiceBaseParams extends EventParams {
  before: {};
}
export interface CreateServerPackageJsonParams extends EventParams {
  before: {
    updateValues: { [key: string]: JsonValue };
  };
}
