import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Category, Dish } from '@core/models/dishes.model';
import { DishMode, VegetarianStatus } from '@core/models/types';
import { SpinnerLoaderComponent } from '@shared/components/spinner-loader/spinner-loader.component';

@Component({
  selector: 'app-dishe-form',
  standalone: true,
  imports: [
    CommonModule,
    SpinnerLoaderComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './dishe-form.component.html',
  styleUrl: './dishe-form.component.css'
})
export class DisheFormComponent {
  protected dishForm!: FormGroup;
  protected imagePreview: string | null = null;
  protected selectedFile: File | null = null;
  protected isOpen: boolean = false;
  @Input() categories: Category[] = [];
  @Output() submitForm = new EventEmitter<Dish>();
  editedDish?: Dish;
  @ViewChild(SpinnerLoaderComponent) spinner!: SpinnerLoaderComponent;

  constructor(private fb: FormBuilder) {
    this.createForm();
  }

  ngOnInit() { }

  private createForm() {
    this.dishForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
      category: [null, Validators.required],
      status: ['REGULAR', Validators.required],
      ingredients: this.fb.array([]),
      allergens: this.fb.array([]),
      available: [true],
      imageInputType: ['file'], // 'file' ou 'url'
      imageUrl: [''],
      type: ['Non-Vegetarian'],
      date: [null]
    });

    // Observer pour le status qui affiche/cache le champ date
    this.dishForm.get('status')?.valueChanges.subscribe(status => {
      const dateControl = this.dishForm.get('date');
      if (status === 'DAILY') {
        dateControl?.setValidators(Validators.required);
      } else {
        dateControl?.clearValidators();
      }
      dateControl?.updateValueAndValidity();
    });

    this.dishForm.get('imageInputType')?.valueChanges.subscribe(type => {
      const imageUrlControl = this.dishForm.get('imageUrl');
      if (type === 'url') {
        imageUrlControl?.setValidators([Validators.required, Validators.pattern(/^https?:\/\/.+/)]);
      } else {
        imageUrlControl?.clearValidators();
      }
      imageUrlControl?.updateValueAndValidity();
    });
  }

  get ingredientsArray() {
    return this.dishForm.get('ingredients') as FormArray;
  }

  get allergensArray() {
    return this.dishForm.get('allergens') as FormArray;
  }

  protected addIngredient() {
    this.ingredientsArray.push(this.fb.control(''));
  }

  protected removeIngredient(index: number) {
    this.ingredientsArray.removeAt(index);
  }

  protected addAllergen() {
    this.allergensArray.push(this.fb.control(''));
  }

  protected removeAllergen(index: number) {
    this.allergensArray.removeAt(index);
  }

  onSubmit() {
    if (this.dishForm.valid) {
      const formData = new FormData();
      const dishData = this.dishForm.value;
      if (this.dishForm.get('imageInputType')?.value === 'file' && this.selectedFile) {
        formData.append('image', this.selectedFile);
      }
      Object.keys(dishData).forEach(key => {
        if (key !== 'image') {
          formData.append(key, dishData[key]);
        }
      });
      console.log('Données du formulaire:', this.formatDataToDish(formData));
      this.submitForm.emit(this.formatDataToDish(formData));
    }
  }

  //

  closeModal() {
    // Réinitialise les champs dynamiques (ingrédients et allergènes)
    this.ingredientsArray.clear();
    this.allergensArray.clear();

    // Réinitialise l'aperçu de l'image et le fichier sélectionné
    this.imagePreview = null;
    this.selectedFile = null;

    // Réinitialise le formulaire
    this.dishForm.reset({
      name: '',
      description: '',
      price: 0,
      category: null,
      status: 'REGULAR',
      ingredients: [],
      allergens: [],
      available: true,
      imageInputType: 'file',
      imageUrl: '',
      type: 'Non-Vegetarian',
      date: null,
    });

    // Ferme le modal
    this.isOpen = false;
    this.editedDish = undefined;
  }


  openModal() {
    this.isOpen = true;
  }

  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      // Vérification de la taille du fichier (5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Le fichier est trop volumineux. La taille maximum est de 5MB.');
        return;
      }

      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  removeImage() {
    this.imagePreview = null;
    this.selectedFile = null;
    const fileInput = document.getElementById('file-upload') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }

  handleImageError(event: Event) {
    const img = event.target as HTMLImageElement;
    img.src = 'assets/Images/default-dish.png';
    alert('Impossible de charger l\'image. Veuillez vérifier l\'URL.');
  }

  editDish(dish: Dish) {
    this.editedDish = dish;
    // Met à jour les valeurs des champs simples
    this.dishForm.patchValue({
      name: dish.name,
      description: dish.description,
      price: dish.price,
      category: dish.category.id,
      status: dish.status,
      available: dish.available,
      imageInputType: dish.imageUrl ? 'url' : 'file',
      imageUrl: dish.imageUrl || '',
      type: dish.type,
      date: dish.date ? new Date(dish.date) : null // Conversion en format `Date` si nécessaire
    });
    this.ingredientsArray.clear();
    if (dish.ingredients && dish.ingredients.length > 0) {
      dish.ingredients.forEach(ingredient => {
        this.ingredientsArray.push(this.fb.control(ingredient));
      });
    }
    // Remplit les allergènes
    this.allergensArray.clear();
    if (dish.allergens && dish.allergens.length > 0) {
      dish.allergens.forEach(allergen => {
        this.allergensArray.push(this.fb.control(allergen));
      });
    }
    // Gère la prévisualisation de l'image si une URL est fournie
    if (dish.imageUrl) {
      this.imagePreview = dish.imageUrl;
      this.selectedFile = null; // Réinitialise le fichier sélectionné
    } else {
      this.imagePreview = null;
    }
    this.openModal();
  }

  startLoader() {
    this.spinner.open();
  }

  stopLoader(succes: boolean, time: number = 1000) {
    this.spinner.succes(succes);
    setTimeout(() => {
      this.spinner.close();
    }, time);
  }


  private formatDataToDish(formData: FormData): Dish {
    let category = this.categories.find(c => c.id == Number(formData.get("category")?.toString()))
    return {
      id: this.editedDish?.id || 0,
      name: formData.get('name')?.toString() || '',
      description: formData.get('description')?.toString() || '',
      price: Number(formData.get('price')) || 0,
      category: category ?? { id: 0, name: 'Inconnue' },
      status: formData.get('status')?.toString() as DishMode || 'REGULAR',
      available: formData.get('available') === 'true',
      imageUrl: formData.get('imageUrl')?.toString() || '',
      type: formData.get('type')?.toString() as VegetarianStatus || '',
      date: new Date(formData.get('date')?.toString() || ''),
      ingredients: [
        ...(formData.get('ingredients')?.toString() || '').split(',').map(ingredient => ingredient.trim())
          .filter(ingredient => ingredient !== '')
      ],
      allergens: [
        ...(formData.get('allergens')?.toString() || '').split(',').map(allerg => allerg.trim()).filter(allerg => allerg !== '')
      ],
    };
  };

}
