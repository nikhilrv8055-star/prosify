import { prisma } from '@/lib/prisma';
import { store } from '@/lib/data/store';
import {
  getServerProperties,
  createServerProperty,
  updateServerProperty,
  deleteServerProperty,
  getServerProjects,
  createServerProject,
  updateServerProject,
  deleteServerProject,
  getServerDevelopers,
  createServerDeveloper,
  updateServerDeveloper,
  deleteServerDeveloper,
} from '@/lib/data/serverStore';
import {
  Property,
  Project,
  Developer,
  Unit,
  UnitStatus,
  PropertyType,
  ListingType,
  PossessionStatus,
} from '@/lib/types';

// Helper to check if live PostgreSQL connection is active
async function isDbAvailable(): Promise<boolean> {
  if (!prisma || !process.env.DATABASE_URL) return false;
  try {
    // Quick query timeout to avoid hanging if DB unreachable
    await Promise.race([
      prisma.$queryRaw`SELECT 1`,
      new Promise((_, reject) => setTimeout(() => reject(new Error('DB Timeout')), 1200)),
    ]);
    return true;
  } catch {
    return false;
  }
}

export class DataService {
  // ==========================================
  // PROPERTIES CRUD & FILTER
  // ==========================================
  async getProperties(filters?: {
    city?: string;
    locality?: string;
    propertyType?: string;
    bhk?: string;
    listingType?: string;
    minPrice?: number;
    maxPrice?: number;
    possessionStatus?: string;
    verifiedOnly?: boolean;
    searchQuery?: string;
    sort?: string;
  }): Promise<Property[]> {
    if (await isDbAvailable()) {
      try {
        const where: Record<string, unknown> = { isPublished: true };
        if (filters?.propertyType && filters.propertyType !== 'ALL') {
          where.propertyType = filters.propertyType as PropertyType;
        }
        if (filters?.listingType && filters.listingType !== 'ALL') {
          where.listingType = filters.listingType as ListingType;
        }
        if (filters?.possessionStatus && filters.possessionStatus !== 'ALL') {
          where.possessionStatus = filters.possessionStatus as PossessionStatus;
        }
        if (filters?.verifiedOnly) {
          where.isVerified = true;
        }
        if (filters?.minPrice || filters?.maxPrice) {
          where.price = {
            ...(filters.minPrice ? { gte: filters.minPrice } : {}),
            ...(filters.maxPrice ? { lte: filters.maxPrice } : {}),
          };
        }

        const dbProps = await prisma.property.findMany({
          where,
          include: {
            city: true,
            locality: true,
            developer: true,
            project: true,
            media: true,
            amenities: true,
          },
          orderBy: filters?.sort === 'price_asc'
            ? { price: 'asc' }
            : filters?.sort === 'price_desc'
            ? { price: 'desc' }
            : filters?.sort === 'newest'
            ? { createdAt: 'desc' }
            : { isFeatured: 'desc' },
        });

        if (dbProps.length > 0) {
          return dbProps.map((p: any) => ({
            id: p.id,
            title: p.title,
            slug: p.slug,
            listingType: p.listingType as ListingType,
            propertyType: p.propertyType as PropertyType,
            price: p.price,
            pricePerSqft: p.pricePerSqft,
            bhk: p.bhk,
            carpetArea: p.carpetArea,
            builtUpArea: p.builtUpArea,
            floorNumber: p.floorNumber || undefined,
            totalFloors: p.totalFloors || undefined,
            facing: p.facing || undefined,
            furnishingStatus: (p.furnishingStatus as Property['furnishingStatus']) || undefined,
            possessionStatus: p.possessionStatus as PossessionStatus,
            possessionDate: p.possessionDate || undefined,
            isVerified: p.isVerified,
            isFeatured: p.isFeatured,
            isPublished: p.isPublished,
            reraNumber: p.reraNumber || undefined,
            city: p.city?.name || 'Mumbai',
            locality: p.locality?.name || '',
            address: p.locality?.name ? `${p.locality.name}, ${p.city?.name}` : '',
            developerId: p.developerId || undefined,
            developerName: p.developer?.name || undefined,
            projectId: p.projectId || undefined,
            projectName: p.project?.name || undefined,
            coverImage: p.media?.[0]?.url || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&auto=format&fit=crop&q=80',
            images: p.media?.map((m: any) => m.url) || [],
            amenities: p.amenities?.map((a: any) => a.name) || [],
            description: p.description,
            createdAt: p.createdAt.toISOString(),
          }));
        }
      } catch (err) {
        console.warn('Prisma getProperties fallback to store:', err);
      }
    }

    // Fallback / Persistent Server Store
    let props = getServerProperties();
    if (filters?.city && filters.city !== 'ALL') {
      props = props.filter((p) => p.city.toLowerCase() === filters.city!.toLowerCase());
    }
    if (filters?.propertyType && filters.propertyType !== 'ALL') {
      props = props.filter((p) => p.propertyType === filters.propertyType);
    }
    if (filters?.listingType && filters.listingType !== 'ALL') {
      props = props.filter((p) => p.listingType === filters.listingType);
    }
    if (filters?.bhk && filters.bhk !== 'ALL') {
      props = props.filter((p) => p.bhk.includes(filters.bhk!));
    }
    if (filters?.minPrice) {
      props = props.filter((p) => p.price >= filters.minPrice!);
    }
    if (filters?.maxPrice) {
      props = props.filter((p) => p.price <= filters.maxPrice!);
    }
    if (filters?.verifiedOnly) {
      props = props.filter((p) => p.isVerified);
    }
    if (filters?.searchQuery) {
      const q = filters.searchQuery.toLowerCase();
      props = props.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.locality.toLowerCase().includes(q) ||
          p.city.toLowerCase().includes(q) ||
          (p.developerName && p.developerName.toLowerCase().includes(q))
      );
    }
    return props;
  }

  async getPropertyBySlug(slug: string): Promise<Property | null> {
    if (await isDbAvailable()) {
      try {
        const p = await prisma.property.findUnique({
          where: { slug },
          include: {
            city: true,
            locality: true,
            developer: true,
            project: true,
            media: true,
            amenities: true,
          },
        });
        if (p) {
          return {
            id: p.id,
            title: p.title,
            slug: p.slug,
            listingType: p.listingType as ListingType,
            propertyType: p.propertyType as PropertyType,
            price: p.price,
            pricePerSqft: p.pricePerSqft,
            bhk: p.bhk,
            carpetArea: p.carpetArea,
            builtUpArea: p.builtUpArea,
            floorNumber: p.floorNumber || undefined,
            totalFloors: p.totalFloors || undefined,
            facing: p.facing || undefined,
            furnishingStatus: (p.furnishingStatus as Property['furnishingStatus']) || undefined,
            possessionStatus: p.possessionStatus as PossessionStatus,
            possessionDate: p.possessionDate || undefined,
            isVerified: p.isVerified,
            isFeatured: p.isFeatured,
            isPublished: p.isPublished,
            reraNumber: p.reraNumber || undefined,
            city: p.city?.name || 'Mumbai',
            locality: p.locality?.name || '',
            address: p.locality?.name ? `${p.locality.name}, ${p.city?.name}` : '',
            developerId: p.developerId || undefined,
            developerName: p.developer?.name || undefined,
            projectId: p.projectId || undefined,
            projectName: p.project?.name || undefined,
            coverImage: p.media?.[0]?.url || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&auto=format&fit=crop&q=80',
            images: p.media?.map((m: any) => m.url) || [],
            amenities: p.amenities?.map((a: any) => a.name) || [],
            description: p.description,
            createdAt: p.createdAt.toISOString(),
          };
        }
      } catch (err) {
        console.warn('Prisma getPropertyBySlug fallback to store:', err);
      }
    }

    const props = getServerProperties();
    return props.find((p) => p.slug === slug || p.id === slug) || null;
  }

  async getPropertyById(id: string): Promise<Property | null> {
    const props = getServerProperties();
    return props.find((p) => p.id === id || p.slug === id) || null;
  }

  async createProperty(data: Omit<Property, 'id' | 'createdAt'>): Promise<Property> {
    const newProp = createServerProperty(data);
    store.createProperty(newProp);
    return newProp;
  }

  async updateProperty(id: string, data: Partial<Property>): Promise<Property | null> {
    const updated = updateServerProperty(id, data);
    if (updated) {
      store.updateProperty(id, data);
    }
    return updated;
  }

  async deleteProperty(id: string): Promise<boolean> {
    const ok = deleteServerProperty(id);
    if (ok) {
      store.deleteProperty(id);
    }
    return ok;
  }

  // ==========================================
  // PROJECTS CRUD & FILTER
  // ==========================================
  async getProjects(filters?: { city?: string; search?: string; status?: string }): Promise<Project[]> {
    if (await isDbAvailable()) {
      try {
        const where: Record<string, unknown> = { isPublished: true };
        if (filters?.status && filters.status !== 'ALL') {
          where.constructionStatus = filters.status as PossessionStatus;
        }

        const dbProjects = await prisma.project.findMany({
          where,
          include: {
            city: true,
            locality: true,
            developer: true,
            floorPlans: true,
            amenities: true,
            media: true,
            towers: true,
          },
          orderBy: { startingPrice: 'asc' },
        });

        if (dbProjects.length > 0) {
          return dbProjects.map((proj: any) => ({
            id: proj.id,
            name: proj.name,
            slug: proj.slug,
            developerId: proj.developerId,
            developerName: proj.developer?.name || '',
            developerLogo: proj.developer?.logoUrl || '',
            city: proj.city?.name || 'Mumbai',
            district: proj.city?.name || 'Mumbai',
            locality: proj.locality?.name || '',
            address: proj.address,
            startingPrice: proj.startingPrice,
            priceRange: proj.priceRange,
            configurations: proj.configurations,
            totalUnits: proj.totalUnits,
            availableUnits: proj.availableUnits,
            possessionDate: proj.possessionDate,
            constructionStatus: proj.constructionStatus as PossessionStatus,
            reraNumber: proj.reraNumber,
            description: proj.description,
            coverImage: proj.media?.[0]?.url || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&auto=format&fit=crop&q=80',
            gallery: proj.media?.map((m: any) => m.url) || [],
            amenities: proj.amenities?.map((a: any) => a.name) || [],
            towers: proj.towers?.map((t: any) => t.name) || [],
            floorPlans: proj.floorPlans?.map((f: any) => ({
              id: f.id,
              projectId: f.projectId,
              title: f.title,
              bhk: f.bhk,
              carpetArea: f.carpetArea,
              price: f.price,
              imageUrl: f.imageUrl,
            })) || [],
            isFeatured: proj.isFeatured,
            isPublished: proj.isPublished,
          }));
        }
      } catch (err) {
        console.warn('Prisma getProjects fallback to store:', err);
      }
    }

    // Fallback / Persistent Server Store
    let projs = getServerProjects();
    if (filters?.city && filters.city !== 'ALL') {
      projs = projs.filter((p) => p.city.toLowerCase() === filters.city!.toLowerCase());
    }
    if (filters?.search) {
      const q = filters.search.toLowerCase();
      projs = projs.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.locality.toLowerCase().includes(q) ||
          p.city.toLowerCase().includes(q) ||
          p.developerName.toLowerCase().includes(q)
      );
    }
    return projs;
  }

  async getProjectBySlug(slug: string): Promise<Project | null> {
    const projs = getServerProjects();
    return projs.find((p) => p.slug === slug || p.id === slug) || null;
  }

  async getProjectById(id: string): Promise<Project | null> {
    const projs = getServerProjects();
    return projs.find((p) => p.id === id) || null;
  }

  async createProject(data: Omit<Project, 'id'>): Promise<Project> {
    const newProj = createServerProject(data);
    store.createProject(newProj);
    return newProj;
  }

  async updateProject(id: string, data: Partial<Project>): Promise<Project | null> {
    const updated = updateServerProject(id, data);
    if (updated) {
      store.updateProject(id, data);
    }
    return updated;
  }

  async deleteProject(id: string): Promise<boolean> {
    const ok = deleteServerProject(id);
    if (ok) {
      store.deleteProject(id);
    }
    return ok;
  }

  // ==========================================
  // DEVELOPERS CRUD & PROFILES
  // ==========================================
  async getDevelopers(filters?: { search?: string; verifiedOnly?: boolean }): Promise<Developer[]> {
    if (await isDbAvailable()) {
      try {
        const where: Record<string, unknown> = {};
        if (filters?.verifiedOnly) where.isVerified = true;

        const devs = await prisma.developer.findMany({
          where,
          include: {
            projects: true,
          },
        });

        if (devs.length > 0) {
          return devs.map((d: any) => ({
            id: d.id,
            name: d.name,
            slug: d.slug,
            logoUrl: d.logoUrl || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=200&auto=format&fit=crop&q=80',
            about: d.about || '',
            establishedYr: d.establishedYr || 2000,
            website: d.website || '',
            contactEmail: d.contactEmail || '',
            contactPhone: d.contactPhone || '',
            isVerified: d.isVerified,
            totalProjects: d.projects.length,
            completedProjects: Math.floor(d.projects.length * 0.6),
            ongoingProjects: Math.ceil(d.projects.length * 0.4),
            upcomingProjects: 1,
            headquarters: 'Mumbai, Maharashtra',
          }));
        }
      } catch (err) {
        console.warn('Prisma getDevelopers fallback to store:', err);
      }
    }

    let list = getServerDevelopers();
    if (filters?.search) {
      const q = filters.search.toLowerCase();
      list = list.filter((d) => d.name.toLowerCase().includes(q) || d.about.toLowerCase().includes(q));
    }
    if (filters?.verifiedOnly) {
      list = list.filter((d) => d.isVerified);
    }
    return list;
  }

  async getDeveloperBySlug(slug: string): Promise<Developer | null> {
    const devs = getServerDevelopers();
    return devs.find((d) => d.slug === slug || d.id === slug) || null;
  }

  async getDeveloperById(id: string): Promise<Developer | null> {
    const devs = getServerDevelopers();
    return devs.find((d) => d.id === id) || null;
  }

  async createDeveloper(data: Omit<Developer, 'id'>): Promise<Developer> {
    const newDev = createServerDeveloper(data);
    store.createDeveloper(newDev);
    return newDev;
  }

  async updateDeveloper(id: string, data: Partial<Developer>): Promise<Developer | null> {
    const updated = updateServerDeveloper(id, data);
    if (updated) {
      store.updateDeveloper(id, data);
    }
    return updated;
  }

  async deleteDeveloper(id: string): Promise<boolean> {
    const ok = deleteServerDeveloper(id);
    if (ok) {
      const dev = store.getDeveloperById(id);
      if (dev) {
        store.addAuditLog('DEVELOPER_DELETE', 'Developer', `Deleted developer ${dev.name}`, id);
      }
    }
    return ok;
  }

  // ==========================================
  // INVENTORY HIERARCHY & UNITS
  // ==========================================
  async getUnits(projectId?: string, tower?: string, status?: UnitStatus): Promise<Unit[]> {
    let units = store.getUnits(projectId, tower);
    if (status) {
      units = units.filter((u) => u.status === status);
    }
    return units;
  }

  async getUnitById(id: string): Promise<Unit | null> {
    const all = store.getUnits();
    return all.find((u) => u.id === id) || null;
  }

  async createUnit(data: Omit<Unit, 'id'>): Promise<Unit> {
    const newUnit: Unit = {
      ...data,
      id: `unit-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    };
    store.bulkImportUnits([newUnit]);
    store.addAuditLog('UNIT_CREATE', 'Unit', `Added unit ${newUnit.unitNumber} in ${newUnit.tower}`, newUnit.id);
    return newUnit;
  }

  async updateUnit(id: string, updates: Partial<Unit>): Promise<Unit | null> {
    if (updates.status) {
      const updated = store.updateUnitStatus(id, updates.status);
      if (updated) {
        Object.assign(updated, updates);
        return updated;
      }
    }
    const all = store.getUnits();
    const unit = all.find((u) => u.id === id);
    if (!unit) return null;
    Object.assign(unit, updates);
    return unit;
  }

  async deleteUnit(id: string): Promise<boolean> {
    const all = store.getUnits();
    const idx = all.findIndex((u) => u.id === id);
    if (idx === -1) return false;
    store.updateUnitStatus(id, 'BLOCKED');
    return true;
  }

  async getInventoryHierarchy(projectId: string) {
    const project = store.getProjectById(projectId) || store.getProjectBySlug(projectId);
    if (!project) return null;

    const units = store.getUnits(project.id);
    const towers = project.towers || ['Tower A', 'Tower B'];

    const hierarchy = towers.map((towerName) => {
      const towerUnits = units.filter((u) => u.tower === towerName);
      
      // Group by floor
      const floorsMap: Record<number, Unit[]> = {};
      towerUnits.forEach((u) => {
        if (!floorsMap[u.floor]) floorsMap[u.floor] = [];
        floorsMap[u.floor].push(u);
      });

      const floors = Object.keys(floorsMap)
        .map(Number)
        .sort((a, b) => b - a) // Highest floor at top (Stacking Plan style)
        .map((floorNum) => ({
          floorNumber: floorNum,
          units: floorsMap[floorNum].sort((a, b) => a.unitNumber.localeCompare(b.unitNumber)),
        }));

      return {
        towerName,
        totalUnits: towerUnits.length,
        availableUnits: towerUnits.filter((u) => u.status === 'AVAILABLE').length,
        holdUnits: towerUnits.filter((u) => u.status === 'HOLD').length,
        bookedUnits: towerUnits.filter((u) => u.status === 'BOOKED').length,
        soldUnits: towerUnits.filter((u) => u.status === 'SOLD').length,
        floors,
      };
    });

    return {
      project,
      hierarchy,
      stats: {
        totalUnits: units.length,
        available: units.filter((u) => u.status === 'AVAILABLE').length,
        hold: units.filter((u) => u.status === 'HOLD').length,
        booked: units.filter((u) => u.status === 'BOOKED').length,
        sold: units.filter((u) => u.status === 'SOLD').length,
        blocked: units.filter((u) => u.status === 'BLOCKED').length,
      },
    };
  }
}

export const dataService = new DataService();
