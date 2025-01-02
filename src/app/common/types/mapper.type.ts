export interface IMapper<Entity, DTO> {
  toEntity(dto: DTO): Entity;
  toDTO(entity: Entity): DTO;
}
