type InFilterOptions<Entity> = {
  [P in keyof Entity]?: Entity[P];
};
