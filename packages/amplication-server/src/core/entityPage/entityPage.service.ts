import { Injectable, NotFoundException } from '@nestjs/common';
import { EnumBlockType } from 'src/enums/EnumBlockType';
import { BlockTypeService } from '../block/blockType.service';
import { EntityService } from '../entity/entity.service';
import { FindManyEntityPageArgs } from './dto/';
import { EntityPage } from './dto/EntityPage';
import { EnumEntityPageType } from './dto/EnumEntityPageType';
import { CreateEntityPageArgs } from './dto/CreateEntityPageArgs';
import { UpdateEntityPageArgs } from './dto/UpdateEntityPageArgs';
import { IEntityPageSettings } from './dto/IEntityPageSettings';
import { EntityPageSingleRecordSettings } from './dto/EntityPageSingleRecordSettings';
import { EntityPageListSettings } from './dto/EntityPageListSettings';

@Injectable()
export class EntityPageService extends BlockTypeService<
  EntityPage,
  FindManyEntityPageArgs,
  CreateEntityPageArgs,
  UpdateEntityPageArgs
> {
  blockType = EnumBlockType.EntityPage;

  constructor(private readonly entityService: EntityService) {
    super();
  }

  private async validateEntityInApp(
    entityId: string,
    appId: string
  ): Promise<void> {
    if (!this.entityService.isPersistentEntityInSameApp(entityId, appId)) {
      throw new NotFoundException(
        `Can't find persistent entity with ID ${entityId} in ${appId}`
      );
    }
  }

  private async validateEntityFieldNames(
    entityId: string,
    settings: IEntityPageSettings
  ): Promise<void> {
    if (settings.showAllFields) {
      return;
    }
    const nonMatchingNames = await this.entityService.validateAllFieldsExist(
      entityId,
      settings.showFieldList
    );
    throw new NotFoundException(
      `Invalid fields selected: ${Array.from(nonMatchingNames).join(', ')}`
    );
  }

  private async validatePageType(
    pageType: EnumEntityPageType,
    entityId: string,
    singleRecordSettings?: EntityPageSingleRecordSettings,
    listSettings?: EntityPageListSettings
  ) {
    switch (pageType) {
      case EnumEntityPageType.SingleRecord: {
        await this.validateEntityFieldNames(entityId, singleRecordSettings);
        break;
      }
      case EnumEntityPageType.List: {
        /** @todo: validate navigateToPageId */
        await this.validateEntityFieldNames(entityId, listSettings);
        break;
      }
    }
  }

  async create(args: CreateEntityPageArgs): Promise<EntityPage> {
    await Promise.all([
      this.validateEntityInApp(args.data.entityId, args.data.app.connect.id),
      this.validatePageType(
        args.data.pageType,
        args.data.entityId,
        args.data.singleRecordSettings,
        args.data.listSettings
      )
    ]);

    return super.create(args);
  }

  async update(args: UpdateEntityPageArgs): Promise<EntityPage> {
    await this.validatePageType(
      args.data.pageType,
      args.data.entityId,
      args.data.singleRecordSettings,
      args.data.listSettings
    );

    return super.update(args);
  }
}
