export interface PermissionAction {
  key: string;
  label: string;
}

export interface PermissionModule {
  module: string;
  key: string;
  actions: PermissionAction[];
}

export const PERMISSIONS_CONFIG: PermissionModule[] = [
  {
    module: 'Услуги',
    key: 'services',
    actions: [
      { key: 'read',   label: 'Просмотр' },
      { key: 'create', label: 'Создание' },
      { key: 'update', label: 'Редактирование' },
      { key: 'delete', label: 'Удаление' },
    ],
  },
  {
    module: 'Сотрудники',
    key: 'employees',
    actions: [
      { key: 'read',   label: 'Просмотр' },
      { key: 'create', label: 'Создание' },
      { key: 'update', label: 'Редактирование' },
      { key: 'delete', label: 'Удаление' },
    ],
  },
  {
    module: 'Записи',
    key: 'appointments',
    actions: [
      { key: 'read',   label: 'Просмотр' },
      { key: 'create', label: 'Создание' },
      { key: 'update', label: 'Редактирование' },
      { key: 'cancel', label: 'Отмена' },
    ],
  },
  {
    module: 'Должности',
    key: 'positions',
    actions: [
      { key: 'read',   label: 'Просмотр' },
      { key: 'create', label: 'Создание' },
      { key: 'update', label: 'Редактирование' },
      { key: 'delete', label: 'Удаление' },
    ],
  },
  {
    module: 'Отчёты',
    key: 'reports',
    actions: [
      { key: 'read', label: 'Просмотр' },
    ],
  },
];

export function permissionKey(moduleKey: string, actionKey: string): string {
  return `${moduleKey}:${actionKey}`;
}
