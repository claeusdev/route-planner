
/**
 * @swagger
 components:
  schemas:
    Address:
      type: object
      required:
        - street
        - city
        - country
      properties:
        street:
          type: string
        city:
          type: string
        country:
          type: string
    RouteDetails:
      type: object
      properties:
        estimatedTime:
          type: string
        distance:
          type: string

