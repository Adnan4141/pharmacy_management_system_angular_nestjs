import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { Medicine } from './entities/medicine.entity';
import { CreateMedicineDto, UpdateMedicineDto } from './dto/medicine.dto';

@Injectable()
export class MedicineService {
  constructor(
    @InjectRepository(Medicine)
    private readonly repo: Repository<Medicine>,
  ) {}

  findAll(): Promise<Medicine[]> {
    return this.repo.find({ order: { name: 'ASC' } });
  }

  async findOne(id: number): Promise<Medicine> {
    const med = await this.repo.findOneBy({ id });
    if (!med) throw new NotFoundException(`Medicine #${id} not found`);
    return med;
  }

  search(query: string): Promise<Medicine[]> {
    if (!query) return this.findAll();
    return this.repo.find({
      where: [
        { name: ILike(`%${query}%`) },
        { genericName: ILike(`%${query}%`) },
        { barcode: ILike(`%${query}%`) },
      ],
      order: { name: 'ASC' },
    });
  }

  create(dto: CreateMedicineDto): Promise<Medicine> {
    const medicine = this.repo.create(dto);
    return this.repo.save(medicine);
  }

  async update(id: number, dto: UpdateMedicineDto): Promise<Medicine> {
    await this.findOne(id);
    await this.repo.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.findOne(id);
    await this.repo.delete(id);
  }

  async seed(): Promise<Medicine[]> {
    const count = await this.repo.count();
    if (count > 0) return this.findAll();

    const medicines: CreateMedicineDto[] = [
      { name: 'Paracetamol 500mg', genericName: 'Paracetamol', barcode: '100001', price: 5.00, stock: 500, manufacturer: 'Square Pharma', dosageForm: 'Tablet', strength: '500mg' },
      { name: 'Amoxicillin 250mg', genericName: 'Amoxicillin', barcode: '100002', price: 12.00, stock: 300, manufacturer: 'Beximco Pharma', dosageForm: 'Capsule', strength: '250mg' },
      { name: 'Omeprazole 20mg', genericName: 'Omeprazole', barcode: '100003', price: 8.00, stock: 400, manufacturer: 'Incepta Pharma', dosageForm: 'Capsule', strength: '20mg' },
      { name: 'Metformin 500mg', genericName: 'Metformin', barcode: '100004', price: 6.00, stock: 350, manufacturer: 'ACI Ltd', dosageForm: 'Tablet', strength: '500mg' },
      { name: 'Ciprofloxacin 500mg', genericName: 'Ciprofloxacin', barcode: '100005', price: 15.00, stock: 200, manufacturer: 'Renata Ltd', dosageForm: 'Tablet', strength: '500mg' },
      { name: 'Amlodipine 5mg', genericName: 'Amlodipine', barcode: '100006', price: 10.00, stock: 250, manufacturer: 'Square Pharma', dosageForm: 'Tablet', strength: '5mg' },
      { name: 'Azithromycin 500mg', genericName: 'Azithromycin', barcode: '100007', price: 20.00, stock: 150, manufacturer: 'Beximco Pharma', dosageForm: 'Tablet', strength: '500mg' },
      { name: 'Losartan 50mg', genericName: 'Losartan', barcode: '100008', price: 14.00, stock: 180, manufacturer: 'Incepta Pharma', dosageForm: 'Tablet', strength: '50mg' },
      { name: 'Cetirizine 10mg', genericName: 'Cetirizine', barcode: '100009', price: 4.00, stock: 600, manufacturer: 'Eskayef', dosageForm: 'Tablet', strength: '10mg' },
      { name: 'Ranitidine 150mg', genericName: 'Ranitidine', barcode: '100010', price: 3.50, stock: 450, manufacturer: 'ACI Ltd', dosageForm: 'Tablet', strength: '150mg' },
      { name: 'Diclofenac 50mg', genericName: 'Diclofenac', barcode: '100011', price: 7.00, stock: 320, manufacturer: 'Renata Ltd', dosageForm: 'Tablet', strength: '50mg' },
      { name: 'Salbutamol Inhaler', genericName: 'Salbutamol', barcode: '100012', price: 120.00, stock: 80, manufacturer: 'Square Pharma', dosageForm: 'Inhaler', strength: '100mcg' },
      { name: 'Insulin Glargine', genericName: 'Insulin', barcode: '100013', price: 850.00, stock: 40, manufacturer: 'Novo Nordisk', dosageForm: 'Injection', strength: '100IU/ml' },
      { name: 'Atorvastatin 20mg', genericName: 'Atorvastatin', barcode: '100014', price: 18.00, stock: 220, manufacturer: 'Beximco Pharma', dosageForm: 'Tablet', strength: '20mg' },
      { name: 'Metoprolol 50mg', genericName: 'Metoprolol', barcode: '100015', price: 9.00, stock: 280, manufacturer: 'Incepta Pharma', dosageForm: 'Tablet', strength: '50mg' },
    ];

    const entities = this.repo.create(medicines);
    return this.repo.save(entities);
  }
}
