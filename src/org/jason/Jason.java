package org.jason;

import java.lang.reflect.Field;

public class Jason {
	

	public static void main(String[] args) throws Exception {
		Class<?> cache = Integer.class.getDeclaredClasses()[0]; //1
	      Field myCache = cache.getDeclaredField("cache"); //2
	      myCache.setAccessible(true);//3
	 
	      Integer[] newCache = (Integer[]) myCache.get(cache); //4
	      newCache[132] = newCache[133]; //5
	 
	      int a = 2;
	      int b = a + a;
	      System.out.println(b);
	      System.out.println(a+a);
	      System.out.printf("%d",b);
	      System.out.println();
	      System.out.printf("%d + %d = %d", a, a, b); //
	}
	

}
