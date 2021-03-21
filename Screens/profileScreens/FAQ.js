import React, { Component } from 'react';
import { FlatList, StyleSheet, Text, View, TouchableOpacity, Image, Linking } from 'react-native';
import FAQComponent from '../../components/FAQComponent';



export default class FAQ extends Component {

   state = {
      faq: [

         {
            qustion: 'كيف أعرض مركبتي؟',
            answer: 'عن الطريق الذهاب الى صفحة مركبتي وتعبئة الخانات المطلوبة لعرض المركبة من معلومات وصور ورقم اللوحة'
         },
         {
            qustion: ' المركبات المسموحة',
            answer: 'المركبات المسموحة هي المتواجدة بالنظام ، الخالية من المخالفات ويوجد عليها تأمين'
         },
         {
            qustion: 'كيفية التواصل مع المستأجر / المؤجر',
            answer: 'بإمكانك التواصل مع المستأجر / المؤجر عن طريق محادثة الواتساب المتواجدة عند النقر على حساب المستأجر / المؤجر'
         },
         {
            qustion: 'طرق استلام المركبة ',
            answer: 'اما عن طريق توصيل المركبة لك مع دفع قيمة مضافة للخدمة يحددها المؤجر او عن طريق الاستلام من موقع المؤجر'
         },
         {
            qustion: 'مدة اغلاق / الغاء الطلب ',
            answer: 'بعد ١٢ ساعة من عدم بداية الرحلة او تأكيد الطلب'
         },
         {
            qustion: 'هل بإمكاني عرض مركبة خارج المملكة العربية السعودية؟',
            answer: 'لا ، يتم عرض المركبات ضمن نطاق المملكة العربية السعودية'
         },
         {
            qustion: 'هل بإمكاني عرض مركبة مع وجود مخالفات عليها؟',
            answer: 'عذرًا لا تستطيع عرض مركبتك اذا تواجد مخالفات عليها في النظام'
         },
         {
            qustion: 'هل بإمكاني حجز مركبة دون اضافة بطاقة الدفع ؟ ',
            answer: 'لا ، يشترط لحجز المركبة اضافة معلومات الدفع البنكية'
         },
         {
            qustion: 'سياسة الدفع ',
            answer: 'الدفع يكون عن طريق بطاقة مدى ، فيزا أو الأبل باي'
         },
      ]
   }




   render() {
      return (
         <View style={styles.container}>
            <FlatList
               data={this.state.faq}
               renderItem={({ item }) => <FAQComponent item={item} />}
            />
            <View style={{ padding: 16, justifyContent: 'center', alignItems: 'center' }}>

               <TouchableOpacity
                  onPress={() => {
                     const phone = "0505220440"; //Admin's phone
                     Linking.canOpenURL('https://api.whatsapp.com/send?' + 'phone=' + phone)
                        .then(supported => {
                           if (!supported) {
                              showMessage({
                                 message: 'يرجى تنزيل برنامج الواتس اب',
                                 type: 'danger',
                                 style: {}
                              });
                           } else {
                              return Linking.openURL('https://api.whatsapp.com/send?' + 'phone=' + phone).catch(e => console.warn(e));
                           }
                        })
                  }}
                  style={{ padding: 8, paddingHorizontal: 20, borderRadius: 6, borderColor: '#3fc250', borderWidth: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: '#3fc250' }}>
                  <Image source={{ uri: 'https://img.icons8.com/color/452/whatsapp--v1.png' }} style={{ width: 24, height: 24 }} />
                  <Text style={{ marginLeft: 8, color: '#fff', fontSize: 16 }}>تواصل معنا</Text>
               </TouchableOpacity>
            </View>
         </View>
      );

   }
}

const styles = StyleSheet.create({
   container: {
      flex: 1,
      backgroundColor: '#fff',
      direction: 'rtl'
   }, Button: {
      backgroundColor: '#0092e5',
      justifyContent: 'center',
      alignItems: 'center',
      margin: 10,
      width: 150,
      height: 30,
      borderRadius: 10,
      color: 'white'
   }
});
