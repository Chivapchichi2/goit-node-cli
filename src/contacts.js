import fs from "fs/promises";
import { v4 as uuidv4 } from "uuid";
import path from "path";

const contactsPath = path.resolve("db", "contacts.json");

async function listContacts() {
  try {
    const contacts = await readContacts();
    console.table(contacts);
  } catch (error) {
    console.error(error.message);
  }
}

async function getContactById(contactId) {
  try {
    const contacts = await readContacts();
    const contact = contacts.find(({ id }) => id === contactId);
    if (!contact) {
      console.log(`Contact with id=${contactId} not found`);
      return null;
    }
    console.table(contact);
    return contact;
  } catch (error) {
    console.error(error.message);
    return null;
  }
}

async function removeContact(contactId) {
  try {
    const contacts = await readContacts();
    const index = contacts.findIndex(({ id }) => id === contactId);
    if (index === -1) {
      console.log(`Contact with id=${contactId} not found`);
      return null;
    }
    const removedContact = contacts.splice(index, 1)[0];
    await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
    console.log(`Contact with id=${contactId} removed`);
    return removedContact;
  } catch (error) {
    console.error(error.message);
    return null;
  }
}

async function addContact(name, email, phone) {
  try {
    const contacts = await readContacts();
    const newContact = { id: uuidv4(), name, email, phone };
    contacts.push(newContact);
    await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
    console.log(`Contact with id=${newContact.id} added`);
    return newContact;
  } catch (error) {
    console.error(error.message);
    return null;
  }
}

async function readContacts() {
  const data = await fs.readFile(contactsPath);
  return JSON.parse(data);
}

export { listContacts, getContactById, removeContact, addContact };
