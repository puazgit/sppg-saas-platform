'use client'

import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { CalendarIcon, Loader2 } from 'lucide-react'
import { format } from 'date-fns'
import { id } from 'date-fns/locale'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { cn } from '@/lib/utils'

import {
  createSubscriptionFormSchema,
  type CreateSubscriptionForm,
  SUBSCRIPTION_TIERS
} from '@/features/superadmin/subscription-management/schemas'
import { 
  useCreateSubscription,
  useSubscriptionPackages 
} from '@/features/superadmin/subscription-management/hooks'

interface CreateSubscriptionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  sppgId?: string
}

export function CreateSubscriptionDialog({
  open,
  onOpenChange,
  sppgId
}: CreateSubscriptionDialogProps) {
  const [showAdvanced, setShowAdvanced] = useState(false)
  
  const form = useForm<CreateSubscriptionForm>({
    resolver: zodResolver(createSubscriptionFormSchema),
    defaultValues: {
      sppgId: sppgId || '',
      tier: 'BASIC',
      startDate: new Date(),
      endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
      autoRenew: false,
      status: 'ACTIVE',
      features: [],
      customFeatures: {},
      metadata: {}
    }
  })

  const createMutation = useCreateSubscription()
  const { data: packages, isLoading: packagesLoading } = useSubscriptionPackages()

  const onSubmit = async (data: CreateSubscriptionForm) => {
    try {
      await createMutation.mutateAsync(data)
      form.reset()
      onOpenChange(false)
    } catch (error) {
      console.error('Error creating subscription:', error)
    }
  }

  const handleTierChange = (tier: string) => {
    const selectedPackage = packages?.find(pkg => pkg.tier === tier)
    if (selectedPackage) {
      form.setValue('packageId', selectedPackage.id)
      form.setValue('features', selectedPackage.features)
      form.setValue('maxBeneficiaries', selectedPackage.maxRecipients)
      form.setValue('storageLimit', selectedPackage.storageGb)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Buat Langganan Enterprise</DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Konfigurasi langganan enterprise untuk SPPG dengan fitur lengkap dan kontrol granular.
            Semua field telah divalidasi untuk memastikan konsistensi data enterprise.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Enterprise Basic Configuration */}
            <div className="space-y-4 p-4 border border-primary/20 rounded-lg bg-primary/5">
              <h3 className="text-lg font-medium text-primary">Konfigurasi Enterprise</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="sppgId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">SPPG Enterprise ID *</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Masukkan SPPG ID Enterprise" 
                          {...field}
                          disabled={!!sppgId}
                          className="h-10"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="tier"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">Enterprise Tier *</FormLabel>
                      <Select 
                        onValueChange={(value) => {
                          field.onChange(value)
                          handleTierChange(value)
                        }} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="h-10">
                            <SelectValue placeholder="Pilih tier enterprise" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {SUBSCRIPTION_TIERS.map((tier) => (
                            <SelectItem key={tier.value} value={tier.value}>
                              <div className="flex items-center gap-2">
                                <span className="font-medium">{tier.label}</span>
                                <span className="text-xs text-muted-foreground">
                                  {tier.value === 'ENTERPRISE' ? '(Full Access)' : 
                                   tier.value === 'PRO' ? '(Advanced)' : 
                                   tier.value === 'STANDARD' ? '(Standard)' : '(Basic)'}
                                </span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Enterprise Package Selection */}
              <FormField
                control={form.control}
                name="packageId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Enterprise Package Configuration</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value} disabled={packagesLoading}>
                      <FormControl>
                        <SelectTrigger className="h-10">
                          <SelectValue placeholder={packagesLoading ? "Loading enterprise packages..." : "Pilih package enterprise"} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {packages?.map((pkg) => (
                          <SelectItem key={pkg.id} value={pkg.id}>
                            <div className="flex flex-col gap-1">
                              <span className="font-medium">{pkg.name} - {pkg.tier}</span>
                              <span className="text-xs text-muted-foreground">
                                {pkg.maxRecipients.toLocaleString('id-ID')} penerima • {pkg.maxStaff} staff • {pkg.storageGb}GB storage
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Date Range */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Tanggal Mulai *</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP", { locale: id })
                            ) : (
                              <span>Pilih tanggal</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date: Date) =>
                            date < new Date() || date < new Date("1900-01-01")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Tanggal Berakhir *</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP", { locale: id })
                            ) : (
                              <span>Pilih tanggal</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date: Date) => {
                            const startDate = form.getValues('startDate')
                            return date < startDate || date < new Date("1900-01-01")
                          }}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Status and Auto Renew */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status Langganan *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="ACTIVE">Aktif</SelectItem>
                        <SelectItem value="INACTIVE">Tidak Aktif</SelectItem>
                        <SelectItem value="SUSPENDED">Ditangguhkan</SelectItem>
                        <SelectItem value="EXPIRED">Kedaluwarsa</SelectItem>
                        <SelectItem value="CANCELLED">Dibatalkan</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="autoRenew"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Perpanjangan Otomatis</FormLabel>
                    <Select onValueChange={(value) => field.onChange(value === 'true')} defaultValue={field.value?.toString()}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih opsi" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="true">Ya</SelectItem>
                        <SelectItem value="false">Tidak</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Advanced Settings Toggle */}
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="w-full"
            >
              {showAdvanced ? 'Sembunyikan' : 'Tampilkan'} Pengaturan Lanjutan
            </Button>

            {/* Advanced Settings */}
            {showAdvanced && (
              <div className="space-y-4 p-4 border rounded-lg bg-muted/50">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="maxBeneficiaries"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Maksimal Penerima Manfaat</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="0" 
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="storageLimit"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Limit Penyimpanan (GB)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            step="0.1"
                            placeholder="0.0" 
                            {...field}
                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="maxBeneficiaries"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Maksimal Penerima Manfaat</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="0" 
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="storageLimit"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Limit Penyimpanan (GB)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            step="0.1"
                            placeholder="0.0" 
                            {...field}
                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            )}

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={createMutation.isPending}
              >
                Batal
              </Button>
              <Button 
                type="submit" 
                disabled={createMutation.isPending}
              >
                {createMutation.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Buat Langganan
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}