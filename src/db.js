import { openDB } from 'idb';

export const initDB = async () => {
  return openDB('meuBancoOffline', 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains('usuarios')) {
        db.createObjectStore('usuarios', { keyPath: 'id', autoIncrement: true });
      }
    },
  });
};

export const addUsuario = async (usuario) => {
  const db = await initDB();
  await db.add('usuarios', usuario);
};

export const getUsuarios = async () => {
  const db = await initDB();
  return db.getAll('usuarios');
};

export const deleteUsuario = async (id) => {
  const db = await initDB();
  await db.delete('usuarios', id);
};

export const updateUsuario = async (usuarioAtualizado) => {
  const db = await initDB();
  await db.put('usuarios', usuarioAtualizado);
};