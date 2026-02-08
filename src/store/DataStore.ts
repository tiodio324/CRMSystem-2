import { makeAutoObservable, runInAction } from 'mobx';
import { v4 as uuidv4 } from 'uuid';
import { Client, ClientFormData, Deal, DealFormData, Task, TaskFormData, Contact, FilterParams } from '@/types';
import FirebaseService from '@/firebase';
import { authStore } from './AuthStore';

export class DataStore {
  clients: Client[] = [];
  deals: Deal[] = [];
  tasks: Task[] = [];
  contacts: Contact[] = [];

  clientsLoading = false;
  dealsLoading = false;
  tasksLoading = false;
  error: string | null = null;
  filters: FilterParams = {};

  constructor() { makeAutoObservable(this, {}, { autoBind: true }); }

  get filteredClients(): Client[] {
    let r = this.clients.filter(c => c.isActive);
    if (this.filters.status) r = r.filter(c => c.status === this.filters.status);
    if (this.filters.search) { const s = this.filters.search.toLowerCase(); r = r.filter(c => c.name.toLowerCase().includes(s) || c.email.toLowerCase().includes(s)); }
    return r.sort((a, b) => a.name.localeCompare(b.name, 'ru'));
  }

  get activeClients(): Client[] { return this.clients.filter(c => c.isActive); }
  get activeDeals(): Deal[] { return this.deals.filter(d => d.stage !== 'won' && d.stage !== 'lost'); }
  get pendingTasks(): Task[] { return this.tasks.filter(t => t.status !== 'done' && t.status !== 'cancelled'); }
  get totalDealValue(): number { return this.activeDeals.reduce((s, d) => s + d.amount, 0); }

  getClientById = (id: string): Client | undefined => this.clients.find(c => c.id === id);
  getDealById = (id: string): Deal | undefined => this.deals.find(d => d.id === id);
  getTaskById = (id: string): Task | undefined => this.tasks.find(t => t.id === id);
  getContactsForClient = (clientId: string): Contact[] => this.contacts.filter(c => c.clientId === clientId);

  loadAllData = async (): Promise<void> => { await Promise.all([this.loadClients(), this.loadDeals(), this.loadTasks(), this.loadContacts()]); };

  loadClients = async (): Promise<void> => {
    this.clientsLoading = true;
    try { const d = await FirebaseService.getData<Record<string, Client>>('clients'); runInAction(() => { this.clients = d ? Object.values(d) : []; this.clientsLoading = false; }); }
    catch { runInAction(() => { this.error = 'Ошибка загрузки клиентов'; this.clientsLoading = false; }); }
  };

  loadDeals = async (): Promise<void> => {
    this.dealsLoading = true;
    try { const d = await FirebaseService.getData<Record<string, Deal>>('deals'); runInAction(() => { this.deals = d ? Object.values(d) : []; this.dealsLoading = false; }); }
    catch { runInAction(() => { this.error = 'Ошибка загрузки сделок'; this.dealsLoading = false; }); }
  };

  loadTasks = async (): Promise<void> => {
    this.tasksLoading = true;
    try { const d = await FirebaseService.getData<Record<string, Task>>('tasks'); runInAction(() => { this.tasks = d ? Object.values(d) : []; this.tasksLoading = false; }); }
    catch { runInAction(() => { this.error = 'Ошибка загрузки задач'; this.tasksLoading = false; }); }
  };

  loadContacts = async (): Promise<void> => {
    try { const d = await FirebaseService.getData<Record<string, Contact>>('contacts'); runInAction(() => { this.contacts = d ? Object.values(d) : []; }); }
    catch { console.error('Load contacts error'); }
  };

  createClient = async (data: ClientFormData): Promise<Client | null> => {
    if (!authStore.canManageClients()) return null;
    const now = new Date().toISOString();
    const client: Client = { id: uuidv4(), ...data, company: data.company || '', notes: data.notes || '', source: data.source || '', status: data.status || 'lead', isActive: true, createdAt: now, updatedAt: now };
    try { await FirebaseService.setData(`clients/${client.id}`, client); runInAction(() => { this.clients.push(client); }); return client; }
    catch { return null; }
  };

  updateClient = async (id: string, data: Partial<ClientFormData>): Promise<boolean> => {
    if (!authStore.canManageClients()) return false;
    const i = this.clients.findIndex(c => c.id === id); if (i === -1) return false;
    const u = { ...this.clients[i], ...data, updatedAt: new Date().toISOString() };
    try { await FirebaseService.setData(`clients/${id}`, u); runInAction(() => { this.clients[i] = u; }); return true; }
    catch { return false; }
  };

  deleteClient = async (id: string): Promise<boolean> => {
    if (!authStore.canManageClients()) return false;
    const i = this.clients.findIndex(c => c.id === id); if (i === -1) return false;
    try { await FirebaseService.updateData(`clients/${id}`, { isActive: false }); runInAction(() => { this.clients[i].isActive = false; }); return true; }
    catch { return false; }
  };

  createDeal = async (data: DealFormData): Promise<Deal | null> => {
    if (!authStore.canManageDeals()) return null;
    const client = this.getClientById(data.clientId); if (!client) return null;
    const now = new Date().toISOString();
    const deal: Deal = { id: uuidv4(), ...data, description: data.description || '', clientName: client.name, stage: data.stage || 'new', probability: data.probability || 10, createdAt: now, updatedAt: now };
    try { await FirebaseService.setData(`deals/${deal.id}`, deal); runInAction(() => { this.deals.push(deal); }); return deal; }
    catch { return null; }
  };

  updateDeal = async (id: string, data: Partial<DealFormData>): Promise<boolean> => {
    if (!authStore.canManageDeals()) return false;
    const i = this.deals.findIndex(d => d.id === id); if (i === -1) return false;
    const u = { ...this.deals[i], ...data, updatedAt: new Date().toISOString() };
    try { await FirebaseService.setData(`deals/${id}`, u); runInAction(() => { this.deals[i] = u; }); return true; }
    catch { return false; }
  };

  createTask = async (data: TaskFormData): Promise<Task | null> => {
    if (!authStore.canManageTasks()) return null;
    const now = new Date().toISOString();
    const task: Task = { id: uuidv4(), ...data, description: data.description || '', clientId: data.clientId || '', dealId: data.dealId || '', assignee: data.assignee || '', priority: data.priority || 'medium', status: data.status || 'todo', createdAt: now, updatedAt: now };
    try { await FirebaseService.setData(`tasks/${task.id}`, task); runInAction(() => { this.tasks.push(task); }); return task; }
    catch { return null; }
  };

  updateTask = async (id: string, data: Partial<TaskFormData>): Promise<boolean> => {
    if (!authStore.canManageTasks()) return false;
    const i = this.tasks.findIndex(t => t.id === id); if (i === -1) return false;
    const u = { ...this.tasks[i], ...data, updatedAt: new Date().toISOString() };
    try { await FirebaseService.setData(`tasks/${id}`, u); runInAction(() => { this.tasks[i] = u; }); return true; }
    catch { return false; }
  };

  setFilter = (key: keyof FilterParams, value: string | undefined): void => { this.filters = { ...this.filters, [key]: value }; };
  clearFilters = (): void => { this.filters = {}; };
  clearError = (): void => { this.error = null; };
}

export const dataStore = new DataStore();
