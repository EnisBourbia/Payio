from collections import defaultdict
from math import remainder

from django.utils.translation import activate
from user.models import User
from django.db import models


class Company(models.Model):
    user = models.ForeignKey(User, on_delete=models.PROTECT)
    logo = models.ImageField(upload_to='logos/', blank=True, null=True)
    name = models.CharField(max_length=255, null=False)
    org_number = models.CharField(max_length=255, null=False)
    moms_number = models.CharField(max_length=255, null=False)
    adress = models.CharField(max_length=255, null=False)
    adress_2 = models.CharField(max_length=255, blank=True, null=True)
    attention = models.CharField(max_length=255, blank=True)
    co_adress = models.CharField(max_length=255, blank=True)
    country = models.CharField(max_length=255, null=False, default='Sverige')
    zip_code = models.CharField(max_length=255, null=False)
    city = models.CharField(max_length=255, null=False)
    residence = models.CharField(max_length=255, null=True, blank=True)
    reference = models.CharField(max_length=255, null=False)
    responsible = models.CharField(max_length=255, null=True, blank=True)
    phone_number = models.CharField(max_length=255, null=False)
    email_contact = models.CharField(max_length=255, blank=True)
    email_invoice = models.CharField(max_length=255, null=False)
    bankgiro = models.CharField(max_length=255, null=False, default="")
    iban = models.CharField(max_length=255, blank=True, null=True)
    f_skatt = models.BooleanField(default=False)
    created_on = models.DateTimeField(auto_now_add=True)
    def __str__(self):
        return self.name

class CompanyArrangement(models.Model):
    company = models.OneToOneField(
        Company,
        on_delete=models.PROTECT,
        primary_key=True)
    ### PRICING
    invoice_price = models.DecimalField(max_digits=30, decimal_places=2, default=9)
    delivery_price_email = models.DecimalField(max_digits=30, decimal_places=2, default=0)
    delivery_price_sms = models.DecimalField(max_digits=30, decimal_places=2, default=1)
    delivery_price_Einvoice = models.DecimalField(max_digits=30, decimal_places=2, default=3)
    ### MONTHLY PRICING
    fortnox_integration = models.DecimalField(max_digits=30, decimal_places=2, default=99)

    approved_for_selling = models.BooleanField(default=False)
    interest_for_invoice = models.IntegerField(default=5)
    approved_on_date = models.DateTimeField(blank=True)
    invoice_budget = models.IntegerField(blank=True, default=0)
    created_on = models.DateTimeField(auto_now_add=True)
    def __str__(self):
        return 'Kostnadsupplägg för {}'.format(self.company)

class CompanySellingApplication(models.Model):
    company = models.ForeignKey(Company, on_delete=models.PROTECT)
    expected_sales_number = models.BooleanField(default=False)
    proposed_invoice_budget = models.IntegerField(blank=True)
    created_on = models.DateTimeField(auto_now_add=True)
    def __str__(self):
        return 'Försäljningsansökan för {}'.format(self.company)

class Customer(models.Model):
    belongs_to = models.ForeignKey(Company, on_delete=models.PROTECT)
    customer_number = models.CharField(max_length=255, blank=True)
    name = models.CharField(max_length=255, null=False)
    org_number = models.CharField(max_length=255, null=False)
    attention = models.CharField(max_length=255, blank=True)
    co_adress = models.CharField(max_length=255, blank=True)
    adress = models.CharField(max_length=255, null=False)
    adress_2 = models.CharField(max_length=255, blank=True)
    zip_code = models.CharField(max_length=255, null=False)
    city = models.CharField(max_length=255, null=False)
    country = models.CharField(max_length=255, null=False)
    moms_number = models.CharField(max_length=255, blank=True)
    external_id = models.CharField(max_length=255, blank=True)
    reference = models.CharField(max_length=255, blank=True)
    email_contact = models.CharField(max_length=255, blank=True)
    email_invoice = models.CharField(max_length=255, null=False)
    phone_number = models.CharField(max_length=255, null=False)
    e_invoice_adress = models.CharField(max_length=255, blank=True)
    e_invoice_provider = models.CharField(max_length=255, blank=True)
    notes = models.TextField(blank=True)
    type = models.CharField(
        choices=[
            ("Company", "Company"),
            ("Individual", "Individual"),
        ],
        max_length=10,
        default="Company",
        null=False
    ) 
    active = models.BooleanField(default=True)
    created_on = models.DateTimeField(auto_now_add=True)

    class Meta:
        constraints = [
        models.UniqueConstraint(
            fields=["belongs_to", "customer_number"], 
            name='unique customer_id'
        )
    ]

    def __str__(self):
        return self.name

class Invoice(models.Model):
    company = models.ForeignKey(Company, on_delete=models.PROTECT)
    customer = models.ForeignKey(Customer, on_delete=models.PROTECT)
    access_token = models.CharField(max_length=255, null=False, blank=True)
    language = models.CharField(max_length=255, default='Swedish')
    invoice_number = models.IntegerField(blank=True, null=True)
    ocr_number = models.CharField(max_length=10, null=False, unique=True)
    currency = models.CharField(max_length=4, default='SEK')
    invoice_type = models.CharField(
        choices=[
            ("Simple", "Simple"),
            ("Deal", "Deal"),
            ("Group", "Group"),
        ],
        max_length=10,
        default='Simple'
    )
    customer_reference = models.CharField(max_length=255, blank=True, null=True)
    date = models.DateField()
    expiry_date = models.DateField()
    reminder_date = models.DateField(null=True, blank=True)
    closed_date = models.DateField(blank=True, null=True)  
    netto = models.DecimalField(max_digits=30, decimal_places=2)
    moms = models.DecimalField(max_digits=30, decimal_places=2)
    total = models.DecimalField(max_digits=30, decimal_places=2)
    message = models.TextField(blank=True, null=False)
    delivery = models.CharField(
        choices=[
            ("Email", "Email"),
            ("SMS", "SMS"),
            ("E-Faktura", "E-Faktura"),
            ("Skicka inte", "Skicka inte")
        ],
        max_length=20,
        default='Email'
    )
    status = models.CharField(
        choices=[
            ("Created", "Created"),
            ("Attested", "Attested"),
            ("Sent", "Sent"),
            ("Completed", "Completed"),
        ],
        max_length=10,
        default='Created'
    )
    ###  BETALNINGS KRAV ###
    demand_start_days = models.IntegerField(null=True, blank=True)
    demand_initiation = models.CharField(
        choices=[
            ("Påminnelse", "Påminnelse"),
            ("Förseningsavgift", "Förseningsavgift")
        ],
        max_length=20,
        blank=True,
        null=True
    )
    demand_payment_days = models.IntegerField(null=True, blank=True)
    interest = models.IntegerField(null=False)

    ### DEAL INVOICE
    next_invoice = models.DateField(blank=True, null=True)
    deal_period = models.CharField(
        choices=[
            ("Monthly", "Monthly"),
            ("Quarterly", "Quarterly"),
            ("Yearly", "Yearly")
        ],max_length=10, blank=True, null=True)
    period_day = models.IntegerField(blank=True, null=True)
    period_month = models.IntegerField(blank=True, null=True)
    period_interval = models.IntegerField(blank=True, null=True)
    auto_attest = models.BooleanField(blank=True, null=True)

    created_on = models.DateTimeField(auto_now_add=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["company", "invoice_number"], 
                name='unique invoice_number'
            )
        ]
    def __str__(self):
        return '{} {}'.format(self.company, self.invoice_number)


class InternalInvoice(models.Model):
    customer = models.ForeignKey(Company, on_delete=models.PROTECT)
    access_token = models.CharField(max_length=255, null=False, blank=True)
    language = models.CharField(max_length=255, default='Swedish')
    invoice_number = models.IntegerField(unique=True)
    ocr_number = models.CharField(max_length=10, null=False, unique=True)
    customer_reference = models.CharField(max_length=255, blank=True, null=True)
    date = models.DateField()
    expiry_date = models.DateField()
    reminder_date = models.DateField(null=True, blank=True)
    closed_date = models.DateField(blank=True, null=True)  
    netto = models.DecimalField(max_digits=30, decimal_places=2)
    moms = models.DecimalField(max_digits=30, decimal_places=2)
    total = models.DecimalField(max_digits=30, decimal_places=2)
    message = models.TextField(blank=True, null=False)
    format = models.CharField(
        choices=[
            ("Email", "Email"),
            ("SMS", "SMS"),
            ("E-Faktura", "E-Faktura"),
            ("None", "None")
        ],
        max_length=10,
        default='Email'
    )
    status = models.CharField(
        choices=[
            ("Preparing", "Preparing"),
            ("Sent", "Sent"),
            ("Payed", "Payed"),
        ],
        max_length=10,
        default='Preparing'
    )
    ###  BETALNINGS KRAV ###
    demand_start_days = models.IntegerField(null=True, blank=True)
    demand_initiation = models.CharField(
        choices=[
            ("Påminnelse", "Påminnelse"),
            ("Förseningsavgift", "Förseningsavgift")
        ],
        max_length=20,
        blank=True,
        null=True
    )
    demand_payment_days = models.IntegerField(null=True, blank=True)
    interest = models.IntegerField(null=False)

    created_on = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return '{} {}'.format(self.customer, self.invoice_number)

class Product(models.Model):
    company = models.ForeignKey(Company, on_delete=models.PROTECT)
    product_number = models.CharField(max_length=100, blank=True)
    description = models.CharField(max_length=255, blank=True)
    unit = models.CharField(max_length=15, blank=True)
    price = models.DecimalField(max_digits=30, decimal_places=2)
    type = models.CharField(
        choices=[
            ("Tjänst", "Tjänst"),
            ("Vara", "Vara"),            
        ],
        max_length=15,
        blank=True,
        null=True
    )
    moms = models.IntegerField()
    external_id = models.CharField(max_length=255, blank=True, null=True)
    income_account = models.IntegerField(default=3001)
    outgoing_moms = models.IntegerField(blank=True, default=0)
    sales_account = models.IntegerField(default=3000)
    sales_account_eu = models.IntegerField(default=3003)
    sales_account_eu_moms_free = models.IntegerField(default=3002)
    active = models.BooleanField()

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["company", "product_number"], 
                name='unique product_name'
            )
        ]
    def __str__(self):
        return self.product_number

class InvoiceArticles(models.Model):
    invoice = models.ForeignKey(Invoice, related_name='articles', on_delete=models.CASCADE)
    product = models.ForeignKey(Product, null=True, blank=True, on_delete=models.PROTECT)
    description = models.CharField(max_length=255, null=False)
    amount = models.IntegerField(blank=True, null=True)
    unit = models.CharField(max_length=10, blank=True, null=True)
    price = models.DecimalField(max_digits=30, decimal_places=2)
    moms = models.DecimalField(max_digits=30, decimal_places=2)
    total = models.DecimalField(max_digits=30, decimal_places=2)
    def __str__(self):
        return self.description