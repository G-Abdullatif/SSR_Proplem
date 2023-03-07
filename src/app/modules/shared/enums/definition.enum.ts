export enum DefinitionEnum {
    Disease = 1,
    Relative = 2,
    PatientCancelAppointment = 3,
    DoctorCancelAppointment = 4,
    CommunicationLanguage = 5,
    HealthFacilityType = 6,
    Nationality = 7,
    SpecializationDegree = 8,
    RejectAppointment = 9
}

export class DefinitionsArr {

    public static values() {
      return Object.keys(DefinitionEnum).filter(
        (type) => isNaN(type as any) && type !== 'values'
      );
    }
  }
