/*
 * Copyright 2023 SpinalCom - www.spinalcom.com
 * 
 * This file is part of SpinalCore.
 * 
 * Please read all of the following terms and conditions
 * of the Free Software license Agreement ("Agreement")
 * carefully.
 * 
 * This Agreement is a legally binding contract between
 * the Licensee (as defined below) and SpinalCom that
 * sets forth the terms and conditions that govern your
 * use of the Program. By installing and/or using the
 * Program, you agree to abide by all the terms and
 * conditions stated or referenced herein.
 * 
 * If you do not agree to abide by these terms and
 * conditions, do not demonstrate your acceptance and do
 * not install or use the Program.
 * You should have received a copy of the license along
 * with this file. If not, see
 * <http://resources.spinalcom.com/licenses.pdf>.
 */

export class ModelManager {
   private static _instance: ModelManager;
   private _modelDico : Map<string, Autodesk.Viewing.Model[]> = new Map();


   private constructor() {}

   public static getInstance() {
      if (!this._instance) this._instance = new ModelManager();
      return this._instance;
   }

   public setModels(id: string, model: Autodesk.Viewing.Model | Autodesk.Viewing.Model[]) {
      if (!Array.isArray(model)) model = [model];
      this._modelDico.set(id, model)
   }

   public addNewModel(id: string, model: Autodesk.Viewing.Model | Autodesk.Viewing.Model[]): void {
      const values = this._modelDico.get(id) || [];

      if (!Array.isArray(model)) model = [model]
      values.push(...model);

      this.setModels(id, model);
   }

   public allModelAreLoaded(): boolean {
      if (this._modelDico.size === 0) return false;

      for (const [id, models] of this._modelDico) {
         const found = models.find(el => !el.isLoadDone());
         if (found) return false;
      }

      return true;
   }

   public getSpinalModelID(model: number | Autodesk.Viewing.Model ): string | void {
      const modelId = typeof model === 'number' ? model : model.id;
      for (const [id, mo] of this._modelDico) {
         const found = mo.find(m => m.id == modelId);
         if (found) return id;
      }
   }

   public getModelById(nodeId: string): Autodesk.Viewing.Model[] | void {
      for (const [id, model] of this._modelDico) {
         if (nodeId == id) return model;
      }
   }

   public getModelList(): Map<string, Autodesk.Viewing.Model[]> {
      return this._modelDico;
   }

   public deleteModel(nodeId: string): boolean {
      const deleted = this._modelDico.delete(nodeId);
      if (!deleted && !isNaN(nodeId)) return this._modelDico.delete(Number(nodeId));
      
      return deleted;
   }
}

export default ModelManager